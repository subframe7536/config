import type { OxlintConfig, OxlintOverride } from 'oxlint'

export interface OxlintFlatItem extends Omit<OxlintConfig, 'extends' | 'overrides'> {
  /**
   * Optional label for readability/debugging; stripped from the final Oxlint config.
   */
  name?: string
  /**
   * Glob patterns this config item applies to. When omitted, applies to all files.
   */
  files?: OxlintOverride['files']
  /**
   * Glob patterns excluded from this config item.
   */
  excludeFiles?: OxlintOverride['excludeFiles']
  /**
   * ESLint-style ignores:
   * - When an item only contains `ignores` / `ignorePatterns` (and optionally `name`), treated as global `ignorePatterns`.
   * - Otherwise merged into `excludeFiles` for this item.
   */
  ignores?: Array<string>
  /**
   * Nested configs expanded before this item.
   */
  extends?: Array<OxlintFlatConfigInput>
  /**
   * Nested overrides expanded after this item.
   */
  overrides?: Array<OxlintOverride>
}

export type OxlintFlatConfigInput =
  | OxlintFlatItem
  | OxlintConfig
  | OxlintOverride
  | Array<OxlintFlatConfigInput>
  | false
  | null
  | undefined

const GLOBAL_IGNORES_KEYS = new Set(['name', 'ignores', 'ignorePatterns'])

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasKeys(record: object | undefined): boolean {
  return record !== undefined && Object.keys(record).length > 0
}

function isGlobalIgnoresItem(item: OxlintFlatItem): boolean {
  return (
    ('ignores' in item || 'ignorePatterns' in item) &&
    Object.keys(item).every((key) => GLOBAL_IGNORES_KEYS.has(key))
  )
}

function mergeSettings(
  base: OxlintConfig['settings'],
  next: OxlintConfig['settings'],
): OxlintConfig['settings'] {
  if (!next) {
    return base
  }
  if (!base) {
    return { ...next }
  }
  const merged: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(next)) {
    if (value === undefined) {
      continue
    }
    const existing = merged[key]
    merged[key] =
      isPlainObject(existing) && isPlainObject(value) ? { ...existing, ...value } : value
  }
  return merged as OxlintConfig['settings']
}

function dedupeStrings(values: Array<string>): Array<string> {
  return [...new Set(values)]
}

/**
 * Compose an `OxlintConfig` from ESLint-style flat config inputs in array order.
 *
 * - Nested arrays are flattened and falsy values (`false`, `null`, `undefined`) are skipped.
 * - Root-only fields (`settings`, `options`, `categories`) merge into the root config in order.
 * - Global `plugins` and `ignorePatterns` accumulate with deduplication while preserving order.
 * - Rule/environment fields (`rules`, `env`, `globals`, `jsPlugins`) are emitted as `overrides`
 *   so later items always take precedence over earlier ones (including earlier scoped overrides).
 */
export function composeOxlintConfig(...inputs: Array<OxlintFlatConfigInput>): OxlintConfig {
  const plugins = new Set<NonNullable<OxlintConfig['plugins']>[number]>()
  const ignorePatterns = new Set<string>()
  const overrides: Array<OxlintOverride> = []
  let categories: OxlintConfig['categories']
  let settings: OxlintConfig['settings']
  let options: OxlintConfig['options']

  const applyInput = (input: OxlintFlatConfigInput): void => {
    if (!input) {
      return
    }
    if (Array.isArray(input)) {
      for (const entry of input) {
        applyInput(entry)
      }
      return
    }

    const item: OxlintFlatItem = input

    if (item.extends) {
      for (const ext of item.extends) {
        applyInput(ext)
      }
    }

    if (isGlobalIgnoresItem(item)) {
      for (const pattern of item.ignorePatterns ?? []) {
        ignorePatterns.add(pattern)
      }
      for (const pattern of item.ignores ?? []) {
        ignorePatterns.add(pattern)
      }
      return
    }

    const isScoped = item.files !== undefined

    if (!isScoped && item.plugins) {
      for (const plugin of item.plugins) {
        plugins.add(plugin)
      }
    }
    if (item.ignorePatterns) {
      for (const pattern of item.ignorePatterns) {
        ignorePatterns.add(pattern)
      }
    }
    if (item.categories) {
      categories = { ...categories, ...item.categories }
    }
    if (item.settings) {
      settings = mergeSettings(settings, item.settings)
    }
    if (item.options) {
      options = { ...options, ...item.options }
    }

    const hasOverrideBody =
      hasKeys(item.rules) ||
      hasKeys(item.env) ||
      hasKeys(item.globals) ||
      item.jsPlugins === null ||
      (Array.isArray(item.jsPlugins) && item.jsPlugins.length > 0) ||
      (isScoped && Array.isArray(item.plugins) && item.plugins.length > 0)

    if (hasOverrideBody) {
      const override: OxlintOverride = {
        files: item.files ?? ['**/*'],
      }
      const excludeFiles = dedupeStrings([...(item.excludeFiles ?? []), ...(item.ignores ?? [])])
      if (excludeFiles.length > 0) {
        override.excludeFiles = excludeFiles
      }
      if (isScoped && item.plugins && item.plugins.length > 0) {
        override.plugins = [...new Set(item.plugins)]
      }
      if (hasKeys(item.env)) {
        override.env = item.env
      }
      if (hasKeys(item.globals)) {
        override.globals = item.globals
      }
      if (item.jsPlugins === null || (Array.isArray(item.jsPlugins) && item.jsPlugins.length > 0)) {
        override.jsPlugins = item.jsPlugins
      }
      if (hasKeys(item.rules)) {
        override.rules = item.rules
      }
      overrides.push(override)
    }

    if (item.overrides) {
      for (const nested of item.overrides) {
        applyInput(nested)
      }
    }
  }

  applyInput(inputs)

  const result: OxlintConfig = {}
  if (plugins.size > 0) {
    result.plugins = [...plugins]
  }
  if (categories) {
    result.categories = categories
  }
  if (settings) {
    result.settings = settings
  }
  if (options) {
    result.options = options
  }
  if (ignorePatterns.size > 0) {
    result.ignorePatterns = [...ignorePatterns]
  }
  if (overrides.length > 0) {
    result.overrides = overrides
  }
  return result
}
