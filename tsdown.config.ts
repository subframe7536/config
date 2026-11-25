import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/*.ts',
  deps: { neverBundle: ['tsdown', 'tsdown/config', /^node:/, 'oxlint', 'oxfmt'] },
  exports: {
    customExports(exports) {
      delete exports['./cli']
      return exports
    },
  },
})
