# @subf/config

Universal configuration for TypeScript, SolidJS, oxlint, and oxfmt.

## Quick start

```sh
bun i -D @subf/config
```

## Usage

### `tsconfig`

```json
{
	"extends": "@subf/config/tsc-lib",
}
```

Available configs:
- `tsc-lib`: for libraries.
- `tsc-node`: for Node.js apps.
- `tsc-web`: for SolidJS apps.
- `tsc-base`: base config for custom setups.

### `tsdown`

Helpers to create `tsdown` build configs.

Example: use `lib()` in your `tsdown.config.ts`:

```ts
import { defineConfig } from 'tsdown'
import { lib } from '@subf/config/tsdown'

export default lib({
  entry: 'shallow',
  excludeDeps: ['oxlint', 'oxfmt', 'tsdown'],
  overrides: {
    exports: {
      customExports(exports) {
        exports['./custom'] = './you-custom-file.js'
        return exports
      },
    },
  },
})
```

For Node builds use `nodeLib()`:

```ts
import { nodeLib } from '@subf/config/tsdown'
export default nodeLib({ entry: 'src/index.ts' })
```

For Solid builds (requires `vite-plugin-solid`) use `solidLib()`:

```ts
import { defineConfig } from 'tsdown'
import { solidLib } from '@subf/config/tsdown'

export default solidLib({ entry: 'src/index.tsx' })
```


### `oxfmt`

In `oxfmt.config.ts`:

```ts
import { config } from '@subf/config/oxfmt'
export default config
```

#### Helper
Use `subfFmt()` helper to create a config with opinionated presets for lib, solid, unocss, etc.

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
import { defineConfig } from 'oxlint'
import { CONFIG } from '@subf/config/oxlint'

export default defineConfig({
  extend: [CONFIG],
  // your custom config here
})
```

#### Helper

Use `subf()` helper to create a config with opinionated presets for lib, solid, unocss, etc.

```ts
import { subf } from '@subf/config/oxlint'

export default subf({
  lib: true,
  solid: true,
  unocss: true,
  // your custom oxlint config here
})
```

## License

MIT