#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

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
  console.log('To keep these configs in sync, install @subf/config as a devDependency:')
  console.log('  bun i -D @subf/config')
  console.log('  npm i -D @subf/config')
  process.exit(0)
}

let projectPkg
try {
  projectPkg = JSON.parse(readFileSync(projectPkgPath, 'utf8'))
} catch (err) {
  console.log(
    'Created helper configs. Could not read package.json to suggest install command.',
    err && (err.message || err),
  )
  process.exit(0)
}

const hasDep =
  (projectPkg.devDependencies && projectPkg.devDependencies['@subf/config']) ||
  (projectPkg.dependencies && projectPkg.dependencies['@subf/config'])

if (hasDep) {
  console.log('Helper configs created. @subf/config is present in package.json.')
} else {
  console.log(
    'Helper configs created. To keep them in sync, install @subf/config as a devDependency:',
  )
  console.log('  bun i -D @subf/config')
  console.log('  npm i -D @subf/config')
}

process.exit(0)
