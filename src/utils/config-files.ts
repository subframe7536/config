import { existsSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import { getCompilerOptions } from './tsconfig'
import type { TsconfigType } from './tsconfig'

type ConfigFile = {
  name: string
  content: string
}

export function createConfigs({
  cwd,
  force,
  type,
}: {
  cwd: string
  force: boolean
  type: TsconfigType
}): void {
  const files: ConfigFile[] = [
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
    const fullPath = path.join(cwd, file.name)
    if (existsSync(fullPath) && !force) {
      console.log(`Skipped ${file.name} (exists). Use --force to overwrite.`)
      continue
    }
    writeFileSync(fullPath, file.content, 'utf8')
    created.push(file.name)
    console.log(`Wrote ${file.name}`)
  }

  if (created.length === 0) {
    console.log('No files created.')
  } else {
    console.log('Created:', created.join(', '))
  }
}
