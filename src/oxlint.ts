import {
  FILES_TS_TSX,
  solidConfig,
  solidV2Config,
  solidV2StrictConfig,
} from '@subf/oxlint-plugin/config'
import type { OxlintConfig, OxlintOverride } from 'oxlint'

export {
  FILES_TS_TSX,
  solidConfig as solid,
  solidV2Config as solidV2,
  solidV2StrictConfig as solidV2Strict,
} from '@subf/oxlint-plugin/config'

export const baseConfig: OxlintConfig = {
  env: {
    builtin: true,
    browser: true,
    es2024: true,
    node: true,
  },
  options: {
    reportUnusedDisableDirectives: 'error',
  },
  globals: {
    AudioWorkletGlobalScope: 'readonly',
    AudioWorkletProcessor: 'readonly',
    currentFrame: 'readonly',
    currentTime: 'readonly',
    registerProcessor: 'readonly',
    sampleRate: 'readonly',
    WorkletGlobalScope: 'readonly',
  },
  ignorePatterns: [
    '**/logs',
    '**/*.log',
    '**/npm-debug.log*',
    '**/yarn-debug.log*',
    '**/yarn-error.log*',
    '**/pids',
    '**/*.pid',
    '**/*.seed',
    '**/*.pid.lock',
    '**/lib-cov',
    '**/coverage',
    '**/.nyc_output',
    '**/.grunt',
    '**/bower_components',
    '**/.lock-wscript',
    'build/Release',
    '**/node_modules/',
    '**/jspm_packages/',
    '**/typings/',
    '**/.npm',
    '**/.eslintcache',
    '**/.node_repl_history',
    '**/*.tgz',
    '**/.yarn-integrity',
    '**/.env',
    '**/.cache',
    '**/.next',
    '**/.nuxt',
    '**/dist',
    '**/.serverless',
    '**/.idea',
    '**/*.lerna_backup',
    '**/_fixtures',
    '**/.temp',
    '**/.history',
    '**/.eslint-config-inspector',
    '**/node_modules',
    '**/package-lock.json',
    '**/yarn.lock',
    '**/pnpm-lock.yaml',
    '**/bun.lockb',
    '**/output',
    '**/temp',
    '**/tmp',
    '**/.tmp',
    '**/.vitepress/cache',
    '**/.svelte-kit',
    '**/.vercel',
    '**/.changeset',
    '**/.output',
    '**/.vite-inspect',
    '**/.yarn',
    '**/vite.config.*.timestamp-*',
    '**/CHANGELOG*.md',
    '**/*.min.*',
    '**/LICENSE*',
    '**/__snapshots__',
    '**/components.d.ts',
    '_fixtures',
  ],
}

export const baseRules: OxlintConfig = {
  plugins: ['node', 'jsdoc', 'import', 'unicorn', 'oxc', 'typescript', 'eslint', 'promise'],
  jsPlugins: [{ name: 'subf', specifier: '@subf/oxlint-plugin' }],
  categories: {
    correctness: 'error',
  },
  rules: {
    'subf/method-signature-style': 'error',
    'subf/no-negated-conjunction': 'error',
    'subf/no-negated-disjunction': 'error',

    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'class-methods-use-this': 'error',
    'constructor-super': 'error',
    curly: ['error', 'all'],
    'default-case-last': 'error',
    'default-param-last': 'error',
    eqeqeq: ['error', 'smart'],
    'for-direction': 'error',
    'getter-return': 'error',
    'new-cap': [
      'error',
      {
        capIsNew: false,
        newIsCap: true,
        properties: true,
      },
    ],
    'logical-assignment-operators': ['error', 'always'],
    'no-alert': 'error',
    'no-array-constructor': 'error',
    'no-async-promise-executor': 'error',
    'no-constant-binary-expression': 'error',
    'no-caller': 'error',
    'no-case-declarations': 'error',
    'no-class-assign': 'error',
    'no-compare-neg-zero': 'error',
    'no-cond-assign': ['error', 'except-parens'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-const-assign': 'error',
    'no-control-regex': 'error',
    'no-debugger': 'error',
    'no-delete-var': 'error',
    'no-dupe-class-members': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'no-empty-pattern': 'error',
    'no-empty-static-block': 'error',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-ex-assign': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-boolean-cast': 'error',
    'no-fallthrough': 'error',
    'no-func-assign': 'error',
    'no-global-assign': 'error',
    'no-import-assign': 'error',
    'no-implied-eval': 'error',
    'no-inner-declarations': [
      'error',
      'functions',
      { blockScopedFunctions: 'disallow', namespaces: 'disallow' },
    ],
    'no-irregular-whitespace': 'error',
    'no-iterator': 'error',
    'no-labels': [
      'error',
      {
        allowLoop: false,
        allowSwitch: false,
      },
    ],
    'no-lone-blocks': 'error',
    'no-loss-of-precision': 'error',
    'no-misleading-character-class': 'error',
    'no-multi-str': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-native-nonconstructor': 'error',
    'no-new-wrappers': 'error',
    'no-obj-calls': 'error',
    'no-promise-executor-return': 'error',
    'no-proto': 'error',
    'no-prototype-builtins': 'error',
    'no-redeclare': [
      'error',
      {
        builtinGlobals: false,
      },
    ],
    'no-regex-spaces': 'error',
    'no-restricted-globals': [
      'error',
      {
        message: 'Use `globalThis` instead.',
        name: 'global',
      },
      {
        message: 'Use `globalThis` instead.',
        name: 'self',
      },
    ],
    'no-self-assign': [
      'error',
      {
        props: true,
      },
    ],
    'no-self-compare': 'error',
    'no-shadow-restricted-names': 'error',
    'no-sparse-arrays': 'error',
    'no-template-curly-in-string': 'error',
    'no-this-before-super': 'error',
    'no-throw-literal': 'error',
    'no-undef': 'error',
    'no-unexpected-multiline': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unneeded-ternary': [
      'error',
      {
        defaultAssignment: false,
      },
    ],
    'no-unreachable': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': 'error',
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTaggedTemplates: true,
        allowTernary: true,
      },
    ],
    'no-unused-private-class-members': 'error',
    'no-use-before-define': [
      'error',
      {
        classes: false,
        functions: false,
        variables: true,
      },
    ],
    'no-useless-assignment': 'error',
    'no-useless-backreference': 'error',
    'no-useless-call': 'error',
    'no-useless-catch': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-warning-comments': [
      'error',
      {
        terms: ['@nocommit'],
      },
    ],
    'no-with': 'error',

    'no-empty-character-class': 'error',
    'no-constructor-return': 'error',
    'no-unused-vars': [
      'error',
      {
        args: 'none',
        fix: {
          imports: 'safe-fix',
          variables: 'off',
        },
        varsIgnorePattern: '^_',
      },
    ],
    'no-nonoctal-decimal-escape': 'error',
    'no-setter-return': 'error',
    'no-unused-labels': 'error',
    'no-dupe-else-if': 'error',
    'no-invalid-regexp': 'error',
    'no-constant-condition': 'error',
    'no-useless-escape': 'error',
    'no-unsafe-optional-chaining': 'error',

    'object-shorthand': ['error', 'always'],
    'prefer-arrow-callback': [
      'error',
      {
        allowNamedFunctions: true,
      },
    ],
    'prefer-const': 'error',
    'prefer-exponentiation-operator': 'error',
    'prefer-object-has-own': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-rest-params': 'error',
    'prefer-regex-literals': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'preserve-caught-error': 'error',
    'require-yield': 'error',
    'symbol-description': 'error',
    'unicode-bom': ['error', 'never'],
    'use-isnan': [
      'error',
      {
        enforceForIndexOf: true,
        enforceForSwitchCase: true,
      },
    ],
    'valid-typeof': [
      'error',
      {
        requireStringLiterals: true,
      },
    ],
    'vars-on-top': 'error',
    yoda: ['error', 'never'],
    'node/handle-callback-err': ['error', '^(err|error)$'],
    'node/no-exports-assign': 'error',
    'node/no-new-require': 'error',
    'node/no-path-concat': 'error',
    'promise/no-multiple-resolved': 'error',
    'promise/no-return-in-finally': 'error',
    'jsdoc/check-access': 'warn',
    'jsdoc/check-property-names': 'warn',
    'jsdoc/empty-tags': 'warn',
    'jsdoc/implements-on-classes': 'warn',
    'jsdoc/no-defaults': 'warn',
    'jsdoc/require-param-name': 'warn',
    'jsdoc/require-property': 'warn',
    'jsdoc/require-property-description': 'warn',
    'jsdoc/require-property-name': 'warn',
    'jsdoc/require-returns-description': 'warn',
    'unicorn/catch-error-name': 'error',
    'unicorn/consistent-empty-array-spread': 'error',
    'unicorn/consistent-function-scoping': 'error',
    'unicorn/error-message': 'error',
    'unicorn/escape-case': 'error',
    'unicorn/new-for-builtins': 'error',
    'unicorn/no-abusive-eslint-disable': 'error',
    'unicorn/no-hex-escape': 'error',
    'unicorn/no-instanceof-builtins': 'error',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/no-invalid-fetch-options': 'error',
    'unicorn/no-invalid-remove-event-listener': 'error',
    'unicorn/no-magic-array-flat-depth': 'error',
    'unicorn/no-new-array': 'off',
    'unicorn/no-new-buffer': 'error',
    'unicorn/no-array-fill-with-reference-type': 'error',
    'unicorn/no-typeof-undefined': 'error',
    'unicorn/no-unnecessary-slice-end': 'error',
    'unicorn/no-useless-promise-resolve-reject': 'error',
    'unicorn/no-useless-spread': 'error',
    'unicorn/numeric-separators-style': 'error',
    'unicorn/prefer-array-find': 'error',
    'unicorn/prefer-array-flat-map': 'error',
    'unicorn/prefer-array-index-of': 'error',
    'unicorn/prefer-array-some': 'error',
    'unicorn/prefer-at': 'error',
    'unicorn/prefer-code-point': 'error',
    'unicorn/prefer-date-now': 'error',
    'unicorn/prefer-dom-node-append': 'error',
    'unicorn/prefer-dom-node-text-content': 'error',
    'unicorn/prefer-import-meta-properties': 'error',
    'unicorn/prefer-includes': 'error',
    'unicorn/prefer-native-coercion-functions': 'error',
    'unicorn/prefer-node-protocol': 'error',
    'unicorn/prefer-number-properties': 'error',
    'unicorn/prefer-optional-catch-binding': 'error',
    'unicorn/prefer-set-size': 'error',
    'unicorn/prefer-single-call': 'error',
    'unicorn/prefer-string-raw': 'error',
    'unicorn/prefer-string-replace-all': 'error',
    'unicorn/prefer-string-slice': 'error',
    'unicorn/prefer-string-starts-ends-with': 'error',
    'unicorn/prefer-structured-clone': 'error',
    'unicorn/prefer-top-level-await': 'error',
    'unicorn/prefer-type-error': 'error',
    'unicorn/prefer-set-has': 'error',
    'unicorn/switch-case-braces': ['error', 'avoid'],
    'unicorn/text-encoding-identifier-case': 'error',
    'unicorn/throw-new-error': 'error',
    'import/consistent-type-specifier-style': 'error',
    'import/export': 'error',
    'import/no-absolute-path': 'error',
    'import/no-cycle': 'error',
    'import/no-duplicates': 'error',
    'import/no-self-import': 'error',
    'import/no-named-export': 'allow',
    'import/first': 'error',
    'oxc/no-map-spread': 'error',
    'oxc/misrefactored-assign-op': 'error',
    'oxc/no-this-in-exported-function': 'error',
    'oxc/approx-constant': 'error',
    'oxc/bad-bitwise-operator': 'error',
    'oxc/bad-char-at-comparison': 'error',
    'oxc/bad-comparison-sequence': 'error',
    'oxc/bad-min-max-func': 'error',
    'oxc/bad-object-literal-comparison': 'error',
    'oxc/bad-replace-all-arg': 'error',
    'oxc/const-comparisons': 'error',
    'oxc/double-comparisons': 'error',
    'oxc/missing-throw': 'error',
    'oxc/no-accumulating-spread': 'error',
    'oxc/number-arg-out-of-range': 'error',
    'oxc/uninvoked-array-callback': 'error',
  },
}

export const ts: OxlintOverride = {
  files: FILES_TS_TSX,
  plugins: ['typescript'],
  rules: {
    'constructor-super': 'off',
    'no-class-assign': 'off',
    'no-const-assign': 'off',
    'no-dupe-keys': 'off',
    'no-func-assign': 'off',
    'no-import-assign': 'off',
    'no-new-native-nonconstructor': 'off',
    'no-obj-calls': 'off',
    'no-redeclare': [
      'error',
      {
        builtinGlobals: false,
      },
    ],
    'no-setter-return': 'off',
    'no-this-before-super': 'off',
    'no-undef': 'off',
    'no-unsafe-negation': 'off',
    'no-with': 'off',
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTaggedTemplates: true,
        allowTernary: true,
      },
    ],
    'no-useless-constructor': 'off',
    'no-use-before-define': [
      'error',
      {
        classes: false,
        functions: false,
        variables: false,
      },
    ],
    'typescript/array-type': [
      'error',
      {
        default: 'generic',
      },
    ],
    'typescript/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
      },
    ],
    'typescript/dot-notation': 'error',
    'typescript/method-signature-style': ['error', 'property'],
    'typescript/no-confusing-non-null-assertion': 'error',
    'typescript/no-duplicate-enum-values': 'error',
    'typescript/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
    'typescript/no-explicit-any': 'error',
    'typescript/no-extra-non-null-assertion': 'error',
    'typescript/no-misused-new': 'error',
    'typescript/no-non-null-asserted-nullish-coalescing': 'error',
    'typescript/no-non-null-asserted-optional-chain': 'error',
    'typescript/no-non-null-assertion': 'error',
    'typescript/no-require-imports': 'error',
    'typescript/no-this-alias': 'error',
    'typescript/no-unnecessary-parameter-property-assignment': 'error',
    'typescript/no-unnecessary-type-constraint': 'error',
    'typescript/no-unnecessary-type-conversion': 'error',
    'typescript/no-unnecessary-type-assertion': 'error',
    'typescript/no-unsafe-declaration-merging': 'error',
    'typescript/no-unsafe-function-type': 'error',
    'typescript/no-wrapper-object-types': 'error',
    'typescript/prefer-as-const': 'error',
    'typescript/prefer-literal-enum-member': 'error',
    'typescript/prefer-namespace-keyword': 'error',
    'typescript/prefer-ts-expect-error': 'error',
    'typescript/switch-exhaustiveness-check': [
      'error',
      { allowDefaultCaseForExhaustiveSwitch: true, considerDefaultExhaustiveForUnions: true },
    ],
    'typescript/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: false,
        prefer: 'type-imports',
      },
    ],
    'typescript/no-import-type-side-effects': 'error',
    'typescript/no-unnecessary-type-arguments': 'error',
    'typescript/triple-slash-reference': 'error',
  },
}

export const vitest: OxlintOverride = {
  files: ['**/__tests__/**/*.{js,ts,jsx,tsx}', '**/*.{spec,test,bench,benchmark}.{js,ts,jsx,tsx}'],
  plugins: ['vitest'],
  rules: {
    'vitest/consistent-test-it': [
      'error',
      {
        fn: 'it',
        withinDescribe: 'it',
      },
    ],
    'vitest/no-identical-title': 'error',
    'vitest/no-import-node-test': 'error',
    'vitest/prefer-hooks-in-order': 'error',
    'vitest/prefer-lowercase-title': 'error',
    'vitest/prefer-called-exactly-once-with': 'warn',
    'vitest/require-awaited-expect-poll': 'error',
    'no-unused-expressions': 'off',
    'typescript/no-explicit-any': 'off',
    'typescript/no-non-null-assertion': 'off',
  },
}

export const typeAware: OxlintConfig = {
  options: {
    typeAware: true,
  },
  rules: {
    'typescript/await-thenable': ['error', { allowMixedPromiseArrays: true }],
    'typescript/no-array-delete': 'error',
    'typescript/no-deprecated': 'warn',
    'typescript/no-duplicate-type-constituents': 'error',
    'typescript/no-floating-promises': 'error',
    'typescript/no-for-in-array': 'error',
    'typescript/no-misused-promises': 'error',
    'typescript/no-misused-spread': 'error',
    'typescript/no-unsafe-argument': 'error',
    'typescript/no-unsafe-assignment': 'error',
    'typescript/no-unsafe-call': 'error',
    'typescript/no-unsafe-member-access': 'error',
    'typescript/no-unsafe-return': 'error',
    'typescript/no-unsafe-type-assertion': 'error',
    'typescript/no-unsafe-unary-minus': 'error',
    'typescript/require-array-sort-compare': 'error',
    'typescript/return-await': ['error', 'error-handling-correctness-only'],
    'typescript/unbound-method': 'error',
    'typescript/use-unknown-in-catch-callback-variable': 'error',
  },
  overrides: [
    {
      files: FILES_TS_TSX,
      rules: {
        'no-throw-literal': 'off',
        'typescript/only-throw-error': 'error',
      },
    },
    {
      files: [
        '**/*.{test,spec,integration,e2e}.{ts,tsx,mts,cts}',
        '**/__tests__/**/*.{ts,tsx,mts,cts}',
      ],
      rules: {
        'typescript/no-unsafe-argument': 'off',
        'typescript/no-unsafe-assignment': 'off',
        'typescript/no-unsafe-member-access': 'off',
        'typescript/only-throw-error': 'off',
        'typescript/unbound-method': 'off',
      },
    },
    {
      files: ['**/*.{js,jsx,mjs,cjs}'],
      rules: {
        'typescript/no-unsafe-argument': 'off',
        'typescript/no-unsafe-assignment': 'off',
        'typescript/no-unsafe-call': 'off',
        'typescript/no-unsafe-member-access': 'off',
        'typescript/no-unsafe-return': 'off',
      },
    },
  ],
}

export const markdownOverrideConfig: OxlintOverride = {
  files: ['**/*.md/**/*.{js,ts,jsx,tsx}'],
  rules: {
    'no-alert': 'off',
    'no-labels': 'off',
    'no-lone-blocks': 'off',
    'no-unused-expressions': 'off',
    'no-unused-labels': 'off',
    'unicode-bom': 'off',
  },
}

export const overrides: Array<OxlintOverride> = [ts, vitest, markdownOverrideConfig]

export const CONFIG: OxlintConfig = {
  ...baseConfig,
  ...baseRules,
  overrides,
}

export default CONFIG

export type { OxlintConfig, OxlintOverride }

export type UnoCSSOption = {
  /**
   * @default true
   */
  enable?: boolean
  order?: {
    /**
     * Package name
     * @default '@subf/unocss/oxlint-plugin'
     */
    package?: string
    /**
     * @default ['cn', 'cva']
     */
    unoFunctions?: Array<string>
    unoVariables?: Array<string>
  }
}

function getUnocssOverride(option: UnoCSSOption['order'] = {}): OxlintOverride {
  return {
    files: FILES_TS_TSX,
    jsPlugins: [{ name: 'uno', specifier: option.package || '@subf/unocss/oxlint-plugin' }],
    rules: {
      'uno/order': [
        'warn',
        {
          unoFunctions: option?.unoFunctions || ['cn', 'cva'],
          unoVariables: option?.unoVariables,
        },
      ],
      'uno/blocklist': 'error',
    },
  }
}

export const unocss: OxlintOverride = getUnocssOverride()

export type SolidPreset = 'v1' | 'v2' | 'v2strict'

export interface SubfOptions extends OxlintConfig {
  /**
   * Used for lib, force to explicit function return type
   */
  lib?: boolean
  /**
   * SolidJS lint preset. Passing `true` defaults to `'v2strict'`.
   */
  solid?: boolean | SolidPreset
  typeAware?: boolean
  unocss?: boolean | UnoCSSOption
}

export function subfLint(options: SubfOptions = {}): OxlintConfig {
  const {
    lib,
    unocss: unocssConfig,
    solid: enableSolid,
    typeAware: enableTypeAware,
    overrides,
    extends: userExtends,
    ...oxlint
  } = options
  const ovr: Array<OxlintOverride> = []
  let solidSettings: OxlintConfig['settings']

  if (lib) {
    ovr.push({
      ...ts,
      rules: {
        ...ts.rules,
        'typescript/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowIIFEs: true,
          },
        ],
      },
    })
  } else {
    ovr.push(ts)
  }

  ovr.push(vitest, markdownOverrideConfig)

  if (unocssConfig === true) {
    ovr.push(unocss)
  } else if (typeof unocssConfig === 'object' && unocssConfig.enable !== false) {
    ovr.push(getUnocssOverride(unocssConfig.order))
  }

  if (enableSolid) {
    const solidPreset: SolidPreset = enableSolid === true ? 'v2strict' : enableSolid
    if (solidPreset === 'v1') {
      ovr.push(solidConfig)
    } else {
      const preset = solidPreset === 'v2' ? solidV2Config : solidV2StrictConfig
      if (preset.overrides) {
        ovr.push(...preset.overrides)
      }
      solidSettings = preset.settings
    }
  }

  if (enableTypeAware && typeAware.overrides) {
    ovr.push(...typeAware.overrides)
  }

  if (overrides) {
    ovr.push(...overrides)
  }

  // `env`, `globals`, `settings` and `ignorePatterns` are dropped by `extends`,
  // and a `plugins` array replaces the ones in `extends` configs instead of
  // merging, so they are merged manually. `rules`, `categories`, `jsPlugins`,
  // `options` and `overrides` are left to `extends`.
  return {
    ...oxlint,
    env: { ...baseConfig.env, ...oxlint.env },
    globals: { ...baseConfig.globals, ...oxlint.globals },
    settings: { ...solidSettings, ...oxlint.settings },
    options: {
      ...baseConfig.options,
      ...(enableTypeAware ? typeAware.options : {}),
      ...oxlint.options,
    },
    plugins: [
      ...(baseRules.plugins ?? []),
      ...(userExtends ?? []).flatMap((config) => config.plugins ?? []),
      ...(oxlint.plugins ?? []),
    ],
    ignorePatterns: [
      ...(baseConfig.ignorePatterns ?? []),
      ...(userExtends ?? []).flatMap((config) => config.ignorePatterns ?? []),
      ...(oxlint.ignorePatterns ?? []),
    ],
    extends: [
      baseRules,
      ...(enableTypeAware ? [{ rules: typeAware.rules }] : []),
      ...(userExtends ?? []),
    ],
    overrides: ovr,
  }
}
