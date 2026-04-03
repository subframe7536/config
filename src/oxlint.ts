import type { OxlintConfig, OxlintOverride } from 'oxlint'

export const baseConfig: OxlintConfig = {
  env: {
    builtin: true,
    browser: true,
    es2024: true,
    node: true,
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
    '**/auto-import?(s).d.ts',
    '**/components.d.ts',
    '_fixtures',
  ],
}

export const baseRules: OxlintConfig = {
  plugins: ['node', 'jsdoc', 'import', 'unicorn', 'oxc', 'typescript', 'eslint'],
  jsPlugins: [{ name: 'subf', specifier: '@subf/oxlint-plugin' }],
  categories: {
    correctness: 'error',
  },
  rules: {
    'subf/method-signature-style': ['error', 'property'],

    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'class-methods-use-this': 'error',
    'constructor-super': 'error',
    curly: ['error', 'all'],
    'default-case-last': 'error',
    'default-param-last': 'error',
    eqeqeq: ['error', 'smart'],
    'new-cap': [
      'error',
      {
        capIsNew: false,
        newIsCap: true,
        properties: true,
      },
    ],
    'no-alert': 'error',
    'no-array-constructor': 'error',
    'no-async-promise-executor': 'error',
    'no-constant-binary-expression': 'error',
    'no-caller': 'error',
    'no-case-declarations': 'error',
    'no-class-assign': 'error',
    'no-compare-neg-zero': 'error',
    'no-cond-assign': ['error', 'always'],
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
    'no-inner-declarations': ['error', 'functions', 'disallow'],
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
    'no-use-before-define': [
      'error',
      {
        classes: false,
        functions: false,
        variables: true,
      },
    ],
    'no-useless-call': 'error',
    'no-useless-catch': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-with': 'error',

    'no-empty-character-class': 'error',
    'no-constructor-return': 'error',
    'no-unused-vars': 'error',
    'no-nonoctal-decimal-escape': 'error',
    'no-setter-return': 'error',
    'no-unused-labels': 'error',
    'no-dupe-else-if': 'error',
    'no-invalid-regexp': 'error',
    'no-constant-condition': 'error',
    'no-useless-escape': 'error',
    'no-unsafe-optional-chaining': 'error',

    'prefer-exponentiation-operator': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
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
    'unicorn/consistent-empty-array-spread': 'error',
    'unicorn/error-message': 'error',
    'unicorn/escape-case': 'error',
    'unicorn/new-for-builtins': 'error',
    'unicorn/no-instanceof-builtins': 'error',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/no-new-array': 'allow',
    'unicorn/no-new-buffer': 'error',
    'unicorn/number-literal-case': 'error',
    'unicorn/prefer-array-find': 'error',
    'unicorn/prefer-array-flat-map': 'error',
    'unicorn/prefer-array-some': 'error',
    'unicorn/prefer-code-point': 'error',
    'unicorn/prefer-date-now': 'error',
    'unicorn/prefer-dom-node-text-content': 'error',
    'unicorn/prefer-includes': 'error',
    'unicorn/prefer-node-protocol': 'error',
    'unicorn/prefer-number-properties': 'error',
    'unicorn/prefer-string-starts-ends-with': 'error',
    'unicorn/prefer-type-error': 'error',
    'unicorn/throw-new-error': 'error',
    'unicorn/prefer-set-has': 'error',
    'import/consistent-type-specifier-style': 'error',
    'import/no-absolute-path': 'error',
    'import/no-duplicates': 'error',
    'import/no-self-import': 'error',
    'import/no-named-export': 'allow',
    'import/first': 'error',
    'oxc/no-map-spread': 'error',
    'oxc/misrefactored-assign-op': 'error',
    'oxc/no-this-in-exported-function': 'error',
  },
}

export const FILES_TS_TSX = ['**/*.?([cm])ts', '**/*.?([cm])tsx']
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
        variables: true,
      },
    ],
    'typescript/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
      },
    ],
    'typescript/no-duplicate-enum-values': 'error',
    'typescript/no-extra-non-null-assertion': 'error',
    'typescript/no-misused-new': 'error',
    'typescript/no-non-null-asserted-nullish-coalescing': 'error',
    'typescript/no-non-null-asserted-optional-chain': 'error',
    'typescript/no-require-imports': 'error',
    'typescript/no-this-alias': 'error',
    'typescript/no-unnecessary-type-constraint': 'error',
    'typescript/no-unnecessary-type-assertion': 'error',
    'typescript/no-unsafe-declaration-merging': 'error',
    'typescript/no-unsafe-function-type': 'error',
    'typescript/no-wrapper-object-types': 'error',
    'typescript/prefer-as-const': 'error',
    'typescript/prefer-literal-enum-member': 'error',
    'typescript/prefer-namespace-keyword': 'error',
    'typescript/prefer-ts-expect-error': 'error',
    'typescript/switch-exhaustiveness-check': 'error',
    'typescript/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: false,
        prefer: 'type-imports',
      },
    ],
    'typescript/no-import-type-side-effects': 'error',
    'typescript/no-unnecessary-type-arguments': 'error',
  },
}

export const vitest: OxlintOverride = {
  files: [
    '**/__tests__/**/*.?([cm])[jt]s?(x)',
    '**/*.spec.?([cm])[jt]s?(x)',
    '**/*.test.?([cm])[jt]s?(x)',
    '**/*.bench.?([cm])[jt]s?(x)',
    '**/*.benchmark.?([cm])[jt]s?(x)',
  ],
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
    'no-unused-expressions': 'off',
  },
}

export const markdownOverrideConfig: OxlintOverride = {
  files: ['**/*.md/**/*.?([cm])[jt]s?(x)'],
  rules: {
    'no-alert': 'off',
    'no-labels': 'off',
    'no-lone-blocks': 'off',
    'no-unused-expressions': 'off',
    'no-unused-labels': 'off',
    'unicode-bom': 'off',
  },
}

export const overrides: OxlintOverride[] = [ts, vitest, markdownOverrideConfig]

export const CONFIG: OxlintConfig = {
  ...baseConfig,
  ...baseRules,
  overrides,
}

export const unocss: OxlintOverride = {
  files: FILES_TS_TSX,
  jsPlugins: [{ name: 'uno', specifier: '@unocss/eslint-plugin' }],
  rules: {
    'uno/order': ['warn', { unoFunctions: ['cn', 'cva'] }],
    'uno/blocklist': 'error',
  },
}

export const solid: OxlintOverride = {
  files: FILES_TS_TSX,
  jsPlugins: ['eslint-plugin-solid'],
  rules: {
    'solid/event-handlers': [
      'error',
      {
        // if true, don't warn on ambiguously named event handlers like `onclick` or `onchange`
        ignoreCase: false,
        // if true, warn when spreading event handlers onto JSX. Enable for Solid < v1.6.
        warnOnSpread: false,
      },
    ],
    // these rules are mostly style suggestions
    'solid/imports': 'error',
    // identifier usage is important
    'solid/jsx-no-duplicate-props': 'error',
    'solid/jsx-no-script-url': 'error',
    'solid/no-destructure': 'error',
    // security problems
    'solid/no-innerhtml': ['error', { allowStatic: true }],
    'solid/no-react-deps': 'error',
    'solid/no-react-specific-props': 'error',
    'solid/no-unknown-namespaces': 'error',
    'solid/prefer-for': 'error',
    'solid/prefer-show': 'error',
    'solid/self-closing-comp': 'error',
    'solid/style-prop': ['error', { styleProps: ['style', 'css'] }],
    'solid/jsx-no-undef': ['error', { typescriptEnabled: true }],
    'solid/reactivity': 'warn',
  },
}

export interface SubfOpions extends OxlintConfig {
  /**
   * Used for lib, force to explicit function return type
   */
  lib?: boolean
  solid?: boolean
  unocss?: boolean
}

export function subfLint(options: SubfOpions = {}): OxlintConfig {
  const {
    lib,
    unocss: enableUnocss,
    solid: enableSolid,
    overrides: customOverrides = [],
    ...oxlint
  } = options
  const ovr = [vitest, markdownOverrideConfig]

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

  if (enableUnocss) {
    ovr.push(unocss)
  }

  if (enableSolid) {
    ovr.push(solid)
  }

  ovr.push(...customOverrides)

  return {
    ...baseConfig,
    ...baseRules,
    ...oxlint,
    overrides: ovr,
  }
}
