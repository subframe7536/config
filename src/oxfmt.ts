import { defu } from 'defu'
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

export function subfFmt(config?: OxfmtConfig): OxfmtConfig {
  return defu(CONFIG, config)
}
