import type { OxfmtConfig } from 'oxfmt'

export const CONFIG: OxfmtConfig = {
  semi: false,
  singleQuote: true,
  sortImports: {
    groups: [
      ['side_effect'],
      ['builtin'],
      ['external', 'type-external'],
      ['internal', 'type-internal'],
      ['parent', 'type-parent'],
      ['sibling', 'type-sibling'],
      ['index', 'type-index'],
    ],
  },
}

export default CONFIG

export type { OxfmtConfig }

export function subfFmt(config: OxfmtConfig = {}): OxfmtConfig {
  if (config.sortImports !== undefined && typeof config.sortImports !== 'object') {
    return { ...CONFIG, ...config }
  }
  const base = typeof CONFIG.sortImports === 'object' ? CONFIG.sortImports : {}
  const override = config.sortImports ?? {}
  return {
    ...CONFIG,
    ...config,
    sortImports: {
      ...base,
      ...override,
      groups: [...(base.groups ?? []), ...(override.groups ?? [])],
    },
  }
}
