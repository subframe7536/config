import { lib } from './src/tsdown'

export default lib({
  entry: 'shallow',
  unbundled: ['tsdown', 'tsdown/config', /^node:/],
  extraExports(exports) {
    delete exports['./cli']
    return exports
  },
})
