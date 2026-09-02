import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import { createDefu } from 'defu'

import { getCompilerOptions } from './tsconfig'
import type { TsconfigType } from './tsconfig'

type ConfigFile = {
  name: string
  content: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeConfig(
  existing: Record<string, unknown>,
  generated: Record<string, unknown>,
  overwrite: boolean,
): Record<string, unknown> {
  const merge = createDefu((object, key, value) => {
    if (overwrite) {
      if (isRecord(object[key]) && isRecord(value)) {
        return false
      }
      object[key] = value
      return true
    }
    if (Array.isArray(object[key]) && Array.isArray(value)) {
      object[key] = value
      return true
    }
    return false
  })
  const result = overwrite ? merge(generated, existing) : merge(existing, generated)
  if (!overwrite) {
    restoreNullValues(result, existing)
  }
  return result
}

function restoreNullValues(result: Record<string, unknown>, source: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(source)) {
    if (value === null) {
      result[key] = null
    } else if (isRecord(value) && isRecord(result[key])) {
      restoreNullValues(result[key], value)
    }
  }
}

function getTsconfigContent(
  fullPath: string,
  force: boolean,
  type: TsconfigType,
): string | undefined {
  const generated = { compilerOptions: getCompilerOptions(type) }
  if (!existsSync(fullPath)) {
    return `${JSON.stringify(generated, null, 2)}\n`
  }

  let existing: unknown
  try {
    existing = JSON.parse(readFileSync(fullPath, 'utf8'))
  } catch (error) {
    if (!force) {
      throw new Error(`Failed to parse ${path.basename(fullPath)}: ${String(error)}`)
    }
    return `${JSON.stringify(generated, null, 2)}\n`
  }

  if (!isRecord(existing)) {
    if (!force) {
      throw new Error(`${path.basename(fullPath)} must contain a JSON object`)
    }
    return `${JSON.stringify(generated, null, 2)}\n`
  }

  const merged = mergeConfig(existing, generated, force)
  if (typeof merged.extends === 'string' && merged.extends.includes('@subf/config')) {
    delete merged.extends
  }

  const content = `${JSON.stringify(merged, null, 2)}\n`
  return content === readFileSync(fullPath, 'utf8') ? undefined : content
}

export function createConfigs({
  cwd,
  force,
  type,
}: {
  cwd: string
  force: boolean
  type: TsconfigType
}): void {
  const files: ConfigFile[] = [
    {
      name: 'oxfmt.config.ts',
      content: "import { subfFmt } from '@subf/config/oxfmt'\n\nexport default subfFmt()\n",
    },
    {
      name: 'oxlint.config.ts',
      content: "import { subfLint } from '@subf/config/oxlint'\n\nexport default subfLint()\n",
    },
  ]

  const created: string[] = []
  for (const file of files) {
    const fullPath = path.join(cwd, file.name)
    if (existsSync(fullPath)) {
      if (!force) {
        console.log(`Skipped ${file.name} (exists). Use --force to overwrite.`)
        continue
      }
    } else {
      created.push(file.name)
    }
    writeFileSync(fullPath, file.content, 'utf8')
    console.log(`Wrote ${file.name}`)
  }

  const tsconfigPath = path.join(cwd, 'tsconfig.json')
  const tsconfigContent = getTsconfigContent(tsconfigPath, force, type)
  if (tsconfigContent === undefined) {
    console.log('Skipped tsconfig.json (up to date).')
  } else {
    writeFileSync(tsconfigPath, tsconfigContent, 'utf8')
    created.push('tsconfig.json')
    console.log('Wrote tsconfig.json')
  }

  if (created.length === 0) {
    console.log('No files created.')
  } else {
    console.log('Created:', created.join(', '))
  }
}
