import assert from 'node:assert/strict'
// oxlint-disable-next-line vitest/no-import-node-test
import { describe, it } from 'node:test'

import { composeOxlintConfig, subfLint } from '../src/oxlint.ts'

describe('composeOxlintConfig', () => {
  it('places global rules into overrides in array order so later items win', () => {
    const config = composeOxlintConfig(
      {
        plugins: ['eslint', 'typescript'],
        rules: { 'no-console': 'error' },
      },
      {
        files: ['**/*.ts'],
        rules: { 'typescript/no-explicit-any': 'error' },
      },
      {
        rules: { 'typescript/no-explicit-any': 'off' },
      },
    )

    assert.deepEqual(config.plugins, ['eslint', 'typescript'])
    assert.equal(config.overrides?.length, 3)
    assert.deepEqual(config.overrides?.[0], {
      files: ['**/*'],
      rules: { 'no-console': 'error' },
    })
    assert.deepEqual(config.overrides?.[1], {
      files: ['**/*.ts'],
      rules: { 'typescript/no-explicit-any': 'error' },
    })
    assert.deepEqual(config.overrides?.[2], {
      files: ['**/*'],
      rules: { 'typescript/no-explicit-any': 'off' },
    })
  })

  it('flattens nested arrays, skips falsy inputs, and expands extends before self', () => {
    const config = composeOxlintConfig(
      false,
      null,
      undefined,
      [
        {
          name: 'extended',
          extends: [
            {
              plugins: ['eslint'],
              rules: { 'no-var': 'error' },
            },
          ],
          rules: { 'no-var': 'warn' },
        },
      ],
      {
        ignores: ['**/generated/**'],
      },
    )

    assert.deepEqual(config.plugins, ['eslint'])
    assert.deepEqual(config.ignorePatterns, ['**/generated/**'])
    assert.equal(config.overrides?.length, 2)
    assert.deepEqual(config.overrides?.[0]?.rules, { 'no-var': 'error' })
    assert.deepEqual(config.overrides?.[1]?.rules, { 'no-var': 'warn' })
  })

  it('merges plugin settings namespaces one level deep and deduplicates plugins/ignores', () => {
    const config = composeOxlintConfig(
      {
        plugins: ['eslint', 'typescript'],
        ignorePatterns: ['**/dist', '**/coverage'],
        settings: { solid: { version: 2 } },
      },
      {
        plugins: ['typescript', 'unicorn'],
        ignorePatterns: ['**/dist', '**/tmp'],
        settings: { solid: { custom: true } },
      },
    )

    assert.deepEqual(config.plugins, ['eslint', 'typescript', 'unicorn'])
    assert.deepEqual(config.ignorePatterns, ['**/dist', '**/coverage', '**/tmp'])
    assert.deepEqual(config.settings, { solid: { version: 2, custom: true } })
  })

  it('keeps scoped override plugins local instead of hoisting them to root', () => {
    const config = composeOxlintConfig(
      {
        plugins: ['eslint'],
        categories: { correctness: 'error' },
      },
      {
        files: ['**/*.test.ts'],
        plugins: ['vitest'],
        ignores: ['**/*.snap.test.ts'],
        rules: { 'vitest/no-identical-title': 'error' },
      },
    )

    assert.deepEqual(config.plugins, ['eslint'])
    assert.deepEqual(config.overrides, [
      {
        files: ['**/*.test.ts'],
        excludeFiles: ['**/*.snap.test.ts'],
        plugins: ['vitest'],
        rules: { 'vitest/no-identical-title': 'error' },
      },
    ])
  })
})

describe('subfLint', () => {
  it('lets top-level user rules and variadic flat configs override built-in presets', () => {
    const config = subfLint(
      {
        lib: true,
        solid: true,
        typeAware: true,
        unocss: true,
        rules: {
          'typescript/no-explicit-any': 'off',
        },
      },
      {
        files: ['scripts/**'],
        rules: {
          'no-console': 'off',
        },
      },
      {
        ignores: ['**/fixtures/**'],
      },
    )

    assert.equal(config.extends, undefined)
    assert.equal(config.options?.reportUnusedDisableDirectives, 'error')
    assert.equal(config.options?.typeAware, true)
    assert.deepEqual(config.settings, { solid: { version: 2 } })
    assert.ok(config.ignorePatterns?.includes('**/fixtures/**'))
    assert.ok(!config.plugins?.includes('vitest'))

    const overrides = config.overrides ?? []
    const lastTwo = overrides.slice(-2)
    assert.deepEqual(lastTwo[0], {
      files: ['**/*'],
      rules: { 'typescript/no-explicit-any': 'off' },
    })
    assert.deepEqual(lastTwo[1], {
      files: ['scripts/**'],
      rules: { 'no-console': 'off' },
    })
  })

  it('supports solid v1, v2, and v2strict presets without leaking settings', () => {
    const v1 = subfLint({ solid: 'v1' })
    const v2 = subfLint({ solid: 'v2' })
    const v2strict = subfLint({ solid: 'v2strict' })

    assert.equal(v1.settings, undefined)
    assert.deepEqual(v2.settings, { solid: { version: 2 } })
    assert.deepEqual(v2strict.settings, { solid: { version: 2 } })
  })
})
