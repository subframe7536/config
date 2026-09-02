export const BASE_COMPILER_OPTIONS: Record<string, unknown> = {
  target: 'esnext',
  module: 'esnext',
  lib: ['ESNext'],
  resolveJsonModule: true,
  strict: true,
  strictNullChecks: true,
  noUnusedLocals: true,
  noImplicitOverride: true,
  esModuleInterop: true,
  isolatedModules: true,
  verbatimModuleSyntax: true,
  skipLibCheck: true,
  declaration: true,
  sourceMap: true,
  noEmit: true,
  allowImportingTsExtensions: true,
}

export const TSCONFIG_TYPE = ['node', 'web', 'solid', 'solid-lib']

export type TsconfigType = (typeof TSCONFIG_TYPE)[number]

export function getCompilerOptions(type: TsconfigType): Record<string, unknown> {
  const options = { ...BASE_COMPILER_OPTIONS }
  switch (type) {
    case 'solid':
      options.jsx = 'preserve'
      options.jsxImportSource = 'solid-js'
      options.lib = ['DOM', 'ESNext', 'DOM.Iterable']
      options.types = ['vite/client']
      break
    case 'solid-lib':
      options.jsx = 'preserve'
      options.jsxImportSource = 'solid-js'
      options.lib = ['DOM', 'ESNext', 'DOM.Iterable']
      options.types = ['vite/client']
      options.noUncheckedIndexedAccess = true
      options.strictFunctionTypes = true
      break
    case 'node':
      options.module = 'nodenext'
      options.moduleResolution = 'nodenext'
      break
    case 'lib':
      options.noUncheckedIndexedAccess = true
      options.strictFunctionTypes = true
      break
    default:
      break
  }
  return options
}
