import type { DepsConfig, ExportsOptions, TsdownInputOption, UserConfig } from 'tsdown'
import { mergeConfig } from 'tsdown/config'
interface LibOptions {
  /**
   * The entry point for the library.
   * - 'index' (default): Only include `src/index.ts`.
   * - 'shallow': Include all `.ts` files directly under `src/`.
   * - 'all': Include all `.ts` files under `src/` recursively.
   * - Custom glob pattern or array of file paths.
   *
   * @default 'index'
   */
  entry?: 'index' | 'shallow' | 'all' | Exclude<TsdownInputOption, string>
  /**
   * tsdown's `customExports` option, which controls how the exports field is generated in package.json.
   *
   * @default true
   */
  extraExports?: ExportsOptions['customExports']
  /**
   * tsdown's deps option, which controls how dependencies are bundled / excluded.
   */
  bundled?: DepsConfig['alwaysBundle']
  unbundled?: DepsConfig['neverBundle']
  overrides?: UserConfig
}

export function lib(options: LibOptions = {}): UserConfig {
  const { entry = 'index', extraExports, bundled, unbundled, overrides = {} } = options
  return mergeConfig(
    {
      entry:
        entry === 'index'
          ? 'src/index.ts'
          : entry === 'shallow'
            ? 'src/*.ts'
            : entry === 'all'
              ? 'src/**/*.ts'
              : entry,
      dts: { oxc: true },
      platform: 'neutral',
      deps: {
        alwaysBundle: bundled,
        neverBundle: unbundled,
      },
      exports: { customExports: extraExports },
    },
    overrides,
  )
}

export function nodeLib(options: LibOptions = {}): UserConfig {
  return lib({
    ...options,
    overrides: {
      platform: 'node',
      ...options.overrides,
    },
  })
}

export interface SolidLibOptions extends LibOptions {
  /**
   * Options to pass to the `vite-plugin-solid` plugin. This is useful if you want to customize the solid plugin options, such as enabling hot module replacement (HMR) or configuring the Solid compiler.
   */
  solid?: Record<string, any>
  /**
   * Overrides for the js output config. This is useful if you want to customize the js output config, such as adding additional plugins or changing the output format.
   */
  jsOverride?: UserConfig
  /**
   * Overrides for the jsx output config. This is useful if you want to customize the jsx output config, such as adding additional plugins or changing the output format.
   */
  jsxOverride?: UserConfig
}

async function loadSolidPlugin(options?: Record<string, any>) {
  let solid: any
  try {
    // @ts-expect-error suppress type error
    solid = await import('vite-plugin-solid').then((m) => m.default || m)
  } catch {
    throw new Error('`vite-plugin-solid` is required for solidLib.')
  }
  return solid(options)
}

export async function solidLib(options: SolidLibOptions): Promise<UserConfig[]> {
  const {
    entry,
    solid: solidOptions,
    extraExports,
    overrides = {},
    jsOverride = {},
    jsxOverride = {},
  } = options

  return [
    mergeConfig(
      {
        entry,
        platform: 'browser',
        // use the solid plugin to handle jsx
        plugins: [loadSolidPlugin(solidOptions)],
        dts: true,
      },
      overrides,
      jsOverride,
    ),
    mergeConfig(
      {
        entry,
        platform: 'neutral',
        outExtensions: () => ({ js: '.jsx' }),
        dts: false,
        exports: {
          customExports(exports, context) {
            for (const [key, val] of Object.entries(exports)) {
              if (val.endsWith('.jsx')) {
                exports[key] = {
                  solid: val,
                  default: val.replace('.jsx', '.mjs'),
                  type: val.replace('.jsx', '.d.mts'),
                }
              }
            }
            if (!extraExports) {
              return exports
            } else if (typeof extraExports === 'function') {
              return extraExports(exports, context)
            } else {
              return { ...exports, ...extraExports }
            }
          },
        },
      },
      overrides,
      jsxOverride,
    ),
  ] satisfies UserConfig[]
}
