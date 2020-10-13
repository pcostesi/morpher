const EXTENDS = [
  'airbnb-typescript',
  'prettier',
  'prettier/@typescript-eslint',
]

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-eslint-comments',],
  extends: EXTENDS,
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    node: true,
  },
  rules: {
    'no-underscore-dangle': 0,
  },
  overrides: [
    {
      files: ['**/*.spec.ts', '**/*.test.ts'],
      env: {
        jest: true,
      },
      plugins: ['@typescript-eslint', 'eslint-plugin-eslint-comments', 'jest'],
      extends: [...EXTENDS, 'plugin:jest/recommended'],
      rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
        'max-classes-per-file': 'off',
        'no-restricted-syntax': 'off',
      },
    },
  ],
}
