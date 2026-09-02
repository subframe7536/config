import { createConfigs } from './utils/config-files'
import { updateProjectPackage } from './utils/package-json'
import { getRegistry } from './utils/registry'
import { TSCONFIG_TYPE } from './utils/tsconfig'
import type { TsconfigType } from './utils/tsconfig'

export function parseType(argv: readonly string[]): TsconfigType {
  const index = argv.findIndex((arg) => arg === '--type' || arg.startsWith('--type='))
  if (index < 0) {
    return 'lib'
  }
  const option = argv[index] ?? ''
  const value = option.startsWith('--type=') ? option.slice(7) : argv[index + 1]
  if (!TSCONFIG_TYPE.includes(value || '')) {
    throw new Error(`Invalid type: ${value}. Must be one of ${TSCONFIG_TYPE.join(',')}.`)
  }
  return value as TsconfigType
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

  await updateProjectPackage({ projectRoot, registry: getRegistry() })
  return 0
}
