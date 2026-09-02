import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getLatestVersion } from './registry'

type PackageJson = Record<string, any>

function sortObjectKeys(obj: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)))
}

function ensureDevDependency(
  pkg: PackageJson,
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

function getSelfVersionRange(): string {
  try {
    const moduleDirectory = path.dirname(fileURLToPath(import.meta.url))
    const packagePath = [
      path.resolve(moduleDirectory, '..', 'package.json'),
      path.resolve(moduleDirectory, '..', '..', 'package.json'),
    ].find((candidate) => existsSync(candidate))
    if (!packagePath) {
      return 'latest'
    }
    const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
    if (typeof pkg?.version === 'string' && pkg.version.length > 0) {
      return `^${pkg.version}`
    }
  } catch {
    // Fall back to the registry's latest version when package metadata is unavailable.
  }
  return 'latest'
}

function hasDependency(pkg: PackageJson, name: string): boolean {
  return Boolean(pkg.devDependencies?.[name] || pkg.dependencies?.[name])
}

export async function updateProjectPackage({
  projectRoot,
  registry,
}: {
  projectRoot: string
  registry: string
}): Promise<void> {
  const packagePath = path.join(projectRoot, 'package.json')
  if (!existsSync(packagePath)) {
    console.log('No package.json found in project root.')
    console.log('Skipping dependency injection because package.json is missing.')
    return
  }

  let projectPackage: PackageJson
  try {
    projectPackage = JSON.parse(readFileSync(packagePath, 'utf8'))
  } catch (error) {
    console.log('Created helper configs. Could not read package.json.', error)
    return
  }

  let changed = false
  if (projectPackage.name !== '@subf/config') {
    const result = ensureDevDependency(projectPackage, '@subf/config', getSelfVersionRange())
    changed ||= result.changed
    if (result.changed) {
      console.log(`Added @subf/config@${result.version} to devDependencies.`)
    } else {
      console.log(
        `@subf/config already exists in ${result.location} (${result.version}). No dependency changes needed.`,
      )
    }
  }

  for (const name of ['oxfmt', 'oxlint']) {
    const existing = projectPackage.devDependencies?.[name] || projectPackage.dependencies?.[name]
    if (existing) {
      console.log(`${name} already exists (${existing}). No dependency changes needed.`)
      continue
    }
    try {
      const version = await getLatestVersion(name, registry)
      changed ||= ensureDevDependency(projectPackage, name, `^${version}`).changed
      console.log(`Added ${name}@^${version} to devDependencies.`)
    } catch (error) {
      console.warn(`Warning: could not resolve latest ${name} from ${registry}:`, error)
    }
  }

  if (changed) {
    try {
      writeFileSync(packagePath, `${JSON.stringify(projectPackage, null, 2)}\n`, 'utf8')
    } catch (error) {
      console.log('Created helper configs, but failed to write package.json.', error)
    }
  }

  const missingTools = ['oxfmt', 'oxlint', 'typescript'].filter(
    (name) => !hasDependency(projectPackage, name),
  )
  if (missingTools.length > 0) {
    console.log(`Hint: Install ${missingTools.join(' and ')} to use the generated configs.`)
  }
}
