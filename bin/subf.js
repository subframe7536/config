#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

function createConfigs({ cwd = process.cwd(), force = false } = {}) {
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
      content: `${JSON.stringify({ extends: '@subf/config/tsconfig-lib' }, null, 2)}\n`,
    },
  ]

  const created = []

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

  return created
}

function getSelfVersionRange() {
  try {
    const currentDir = path.dirname(fileURLToPath(import.meta.url))
    const selfPkgPath = path.resolve(currentDir, '..', 'package.json')
    const selfPkg = JSON.parse(readFileSync(selfPkgPath, 'utf8'))

    if (selfPkg && typeof selfPkg.version === 'string' && selfPkg.version.length > 0) {
      return `^${selfPkg.version}`
    }
  } catch {}

  return 'latest'
}

function sortObjectKeys(obj) {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)))
}

function ensureDevDependency(pkg, name, versionRange) {
  const existingDev = pkg.devDependencies && pkg.devDependencies[name]
  if (existingDev) {
    return { changed: false, location: 'devDependencies', version: existingDev }
  }

  const existingDep = pkg.dependencies && pkg.dependencies[name]
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

const projectRoot = process.env.INIT_CWD || process.cwd()
const args = new Set(process.argv.slice(2))
const force = args.has('--force') || args.has('-f')
const help = args.has('--help') || args.has('-h')

if (help) {
  console.log('Usage: subf [-f|--force]')
  console.log('Create helper config files in the current project:')
  console.log('  oxfmt.config.ts, oxlint.config.ts, tsconfig.json')
  console.log('Use -f or --force to overwrite existing files.')
  process.exit(0)
}

try {
  createConfigs({ cwd: projectRoot, force })
} catch (err) {
  console.error('Failed to create config files:', err)
  process.exit(1)
}

// If project has package.json, suggest installing @subf/config when it's not listed
const projectPkgPath = path.join(projectRoot, 'package.json')
if (!existsSync(projectPkgPath)) {
  console.log('No package.json found in project root.')
  console.log('Skipping dependency injection because package.json is missing.')
  process.exit(0)
}

let projectPkg
try {
  projectPkg = JSON.parse(readFileSync(projectPkgPath, 'utf8'))
} catch (err) {
  console.log(
    'Created helper configs. Could not read package.json to add @subf/config.',
    err && (err.message || err),
  )
  process.exit(0)
}

const depName = '@subf/config'
const depVersion = getSelfVersionRange()
const depResult = ensureDevDependency(projectPkg, depName, depVersion)

if (depResult.changed) {
  try {
    writeFileSync(projectPkgPath, `${JSON.stringify(projectPkg, null, 2)}\n`, 'utf8')
    console.log(`Added ${depName}@${depResult.version} to devDependencies in package.json.`)
  } catch (err) {
    console.log(
      `Created helper configs, but failed to write ${depName} into package.json.`,
      err && (err.message || err),
    )
    process.exit(0)
  }
} else {
  console.log(
    `${depName} already exists in ${depResult.location} (${depResult.version}). No dependency changes needed.`,
  )
}

process.exit(0)
