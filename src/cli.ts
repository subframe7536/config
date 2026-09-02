import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE_COMPILER_OPTIONS: Record<string, unknown> = {
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

export type TsconfigType = 'lib' | 'node' | 'web'

export function parseType(argv: readonly string[]): TsconfigType {
  const index = argv.findIndex((arg) => arg === '--type' || arg.startsWith('--type='))
  if (index < 0) {
    return 'lib'
  }
  const option = argv[index] ?? ''
  const value = option.startsWith('--type=') ? option.slice(7) : argv[index + 1]
  return value === 'node' || value === 'web' || value === 'lib' ? value : 'lib'
}

export function getCompilerOptions(type: TsconfigType): Record<string, unknown> {
  const options = { ...BASE_COMPILER_OPTIONS }
  if (type === 'lib') {
    options.noUncheckedIndexedAccess = true
    options.strictFunctionTypes = true
  } else if (type === 'node') {
    options.module = 'nodenext'
    options.moduleResolution = 'nodenext'
  } else {
    options.jsx = 'preserve'
    options.jsxImportSource = 'solid-js'
    options.lib = ['DOM', 'ESNext', 'DOM.Iterable']
    options.types = ['vite/client']
  }
  return options
}

function createConfigs({
  cwd,
  force,
  type,
}: {
  cwd: string
  force: boolean
  type: TsconfigType
}): void {
  const files = [
    {
      name: 'oxfmt.config.ts',
      content: "import { subfFmt } from '@subf/config/oxfmt'\n\nexport default subfFmt()\n",
    },
    {
      name: 'oxlint.config.ts',
      content: "import { subfLint } from '@subf/config/oxlint'\n\nexport default subfLint()\n",
    },
    {
      name: 'tsconfig.json',
      content: `${JSON.stringify({ compilerOptions: getCompilerOptions(type) }, null, 2)}\n`,
    },
  ]
  const created: string[] = []
  for (const file of files) {
    const full = path.join(cwd, file.name)
    if (existsSync(full) && !force) {
      console.log(`Skipped ${file.name} (exists). Use --force to overwrite.`)
      continue
    }
    writeFileSync(full, file.content, 'utf8')
    created.push(file.name)
    console.log(`Wrote ${file.name}`)
  }
  if (created.length === 0) {
    console.log('No files created.')
  } else {
    console.log('Created:', created.join(', '))
  }
}

function getSelfVersionRange(): string {
  try {
    const packagePath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '..',
      'package.json',
    )
    const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
    if (typeof pkg?.version === 'string' && pkg.version.length > 0) {
      return `^${pkg.version}`
    }
  } catch {}
  return 'latest'
}

function sortObjectKeys(obj: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)))
}

function ensureDevDependency(
  pkg: Record<string, any>,
  name: string,
  versionRange: string,
): {
  changed: boolean
  location: 'devDependencies' | 'dependencies'
  version: string
} {
  const existingDev = pkg.devDependencies?.[name]
  if (existingDev) {
    return { changed: false, location: 'devDependencies', version: existingDev }
  }
  const existingDep = pkg.dependencies?.[name]
  if (existingDep) {
    return { changed: false, location: 'dependencies', version: existingDep }
  }
  if (!pkg.devDependencies || typeof pkg.devDependencies !== 'object') {
    pkg.devDependencies = {}
  }
  pkg.devDependencies[name] = versionRange
  pkg.devDependencies = sortObjectKeys(pkg.devDependencies)
  return { changed: true, location: 'devDependencies', version: versionRange }
}

export function getRegistry(env: NodeJS.ProcessEnv = process.env): string {
  return (
    env.npm_config_registry ||
    env.NPM_CONFIG_REGISTRY ||
    'https://registry.npmjs.org'
  ).replace(/\/+$/, '')
}

async function getLatestVersion(name: string, registry: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  try {
    const response = await fetch(`${registry}/${encodeURIComponent(name)}`, {
      signal: controller.signal,
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const metadata = (await response.json()) as { 'dist-tags'?: { latest?: unknown } }
    const version = metadata['dist-tags']?.latest
    if (typeof version !== 'string' || !version.trim()) {
      throw new Error('missing dist-tags.latest')
    }
    return version.trim()
  } finally {
    clearTimeout(timeout)
  }
}

export async function main(argv: readonly string[] = process.argv.slice(2)): Promise<number> {
  const args = new Set(argv)
  const force = args.has('--force') || args.has('-f')
  const help = args.has('--help') || args.has('-h')
  const type = parseType(argv)
  const projectRoot = process.env.INIT_CWD || process.cwd()

  if (help) {
    console.log('Usage: subf [--type lib|node|web] [-f|--force]')
    console.log('')
    console.log('Create oxfmt.config.ts, oxlint.config.ts, and tsconfig.json.')
    console.log('The tsconfig type defaults to lib. Use --force to overwrite existing files.')
    return 0
  }

  try {
    createConfigs({ cwd: projectRoot, force, type })
  } catch (error) {
    console.error('Failed to create config files:', error)
    return 1
  }

  const projectPackagePath = path.join(projectRoot, 'package.json')
  if (!existsSync(projectPackagePath)) {
    console.log('No package.json found in project root.')
    console.log('Skipping dependency injection because package.json is missing.')
    return 0
  }

  let projectPackage: Record<string, any>
  try {
    projectPackage = JSON.parse(readFileSync(projectPackagePath, 'utf8'))
  } catch (error) {
    console.log('Created helper configs. Could not read package.json.', error)
    return 0
  }

  if (projectPackage.name !== '@subf/config') {
    const result = ensureDevDependency(projectPackage, '@subf/config', getSelfVersionRange())
    if (result.changed) {
      console.log(`Added @subf/config@${result.version} to devDependencies.`)
    } else {
      console.log(
        `@subf/config already exists in ${result.location} (${result.version}). No dependency changes needed.`,
      )
    }
  }

  const registry = getRegistry()
  for (const name of ['oxfmt', 'oxlint']) {
    const existing = projectPackage.devDependencies?.[name] || projectPackage.dependencies?.[name]
    if (existing) {
      console.log(`${name} already exists (${existing}). No dependency changes needed.`)
      continue
    }
    try {
      const version = await getLatestVersion(name, registry)
      ensureDevDependency(projectPackage, name, `^${version}`)
      console.log(`Added ${name}@^${version} to devDependencies.`)
    } catch (error) {
      console.warn(`Warning: could not resolve latest ${name} from ${registry}:`, error)
    }
  }

  try {
    writeFileSync(projectPackagePath, `${JSON.stringify(projectPackage, null, 2)}\n`, 'utf8')
  } catch (error) {
    console.log('Created helper configs, but failed to write package.json.', error)
  }
  const missingTools = ['oxfmt', 'oxlint', 'typescript'].filter(
    (name) => !projectPackage.devDependencies?.[name] && !projectPackage.dependencies?.[name],
  )
  if (missingTools.length > 0) {
    console.log(`Hint: Install ${missingTools.join(' and ')} to use the generated configs.`)
  }
  return 0
}
