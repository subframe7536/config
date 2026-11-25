# @subf/config

Universal configuration for TypeScript, oxlint (+unocss, +solid), oxfmt, and tsdown.

## Quick start

```sh
bun i -D @subf/config
```

## Usage

### `tsconfig`

Run `subf` to create or update `tsconfig.json` (the default type is `lib`):

```sh
subf
subf --type node # Node.js apps
subf --type web  # SolidJS apps
```

When `tsconfig.json` already exists, missing settings are added while existing settings are preserved. Use `--force` to overwrite generated settings. Legacy `@subf/config` entries in `extends` are removed automatically.

### `oxfmt`

In `oxfmt.config.ts`:

```ts
import { CONFIG } from '@subf/config/oxfmt'
export default CONFIG
```

#### Helper

Use `subfFmt()` helper to create a `oxfmt` config.

```ts
import { subfFmt } from '@subf/config/oxfmt'
export default subfFmt({
  // your custom oxfmt config here
})
```

### `oxlint`

In `oxlint.config.ts`:

```ts
import { CONFIG } from '@subf/config/oxlint'

export default CONFIG
```

or use `defineConfig()` with `extend` if you want to extend it:

```ts
import { CONFIG } from '@subf/config/oxlint'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extend: [CONFIG],
  // your custom config here
})
```

#### Helper

Use `subf()` helper to create a `oxlint` config with opinionated presets for lib, solid, unocss, etc.

```ts
import { subf } from '@subf/config/oxlint'

export default subf({
  lib: true,
  solid: true,
  unocss: true,
  // your custom oxlint config here
})
```

## CLI

Scaffold `tsconfig.json`, `oxlint.config.ts`, and `oxfmt.config.ts` into your project.

### Quick start (no install)

```sh
bunx @subf/config          # recommended
npx -y @subf/config        # fallback
bunx @subf/config -f       # force overwrite existing files
```

After scaffolding you'll be prompted to install the package so your configs stay in sync with future updates:

```sh
bun i -D @subf/config
```

### Installed locally

```sh
bun i -D @subf/config
bun subf                   # or just `subf` if on PATH
bun subf -f                # force overwrite existing files
```

When `oxlint` or `oxfmt` is missing, `subf` resolves the latest version from the registry and adds it to `devDependencies` (fallback chain: `$npm_config_registry` -> `$NPM_CONFIG_REGISTRY` -> the public npm registry). Registry failures are reported as warnings and do not prevent config generation.

## License

MIT
