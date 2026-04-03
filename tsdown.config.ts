import { defineConfig } from 'tsdown'

import { lib } from './src/tsdown.ts'

export default defineConfig(
  lib({
    entry: 'shallow',
    unbundled: ['tsdown', 'tsdown/config', 'oxfmt', 'oxlint'],
    extraExports: {
      './tsconfig-base': './tsconfig.base.json',
      './tsconfig-node': './tsconfig.node.json',
      './tsconfig-web': './tsconfig.web.json',
      './tsconfig-lib': './tsconfig.lib.json',
    },
  }),
)
