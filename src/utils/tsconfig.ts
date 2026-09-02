export const TSCONFIG_TYPE = ['node', 'lib', 'solid', 'solid-lib'] as const
export type TsconfigType = (typeof TSCONFIG_TYPE)[number]

const BASE_COMPILER_OPTIONS: Record<string, unknown> = {
  target: 'esnext',
  module: 'esnext',
  moduleResolution: 'Bundler',
  moduleDetection: 'force',
  strict: true,
  strictNullChecks: true,
  noUnusedLocals: true,
  noImplicitOverride: true,
  esModuleInterop: true,
  isolatedModules: true,

  skipLibCheck: true,
  verbatimModuleSyntax: true,
  resolveJsonModule: true,

  noEmit: true,
  allowImportingTsExtensions: true,
}

function solidConfigs(options: Record<string, unknown>): void {
  options.jsx = 'preserve'
  options.jsxImportSource = 'solid-js'
  options.lib = ['ES2022', 'DOM', 'DOM.Iterable']
  options.types = ['vite/client']
}

export function getCompilerOptions(type: TsconfigType): Record<string, unknown> {
  const options = { ...BASE_COMPILER_OPTIONS }
  switch (type) {
    case 'solid':
      solidConfigs(options)
      break
    case 'solid-lib':
      solidConfigs(options)
      options.noUncheckedIndexedAccess = true
      break
    case 'node':
      options.target = 'ES2023'
      options.lib = ['ES2023']
      options.module = 'NodeNext'
      options.moduleResolution = 'NodeNext'
      options.types = ['node']
      options.erasableSyntaxOnly = true
      break
    case 'lib':
      options.target = 'ES2023'
      options.lib = ['ES2023']
      options.noUncheckedIndexedAccess = true
      break
    default:
      break
  }
  return options
}
