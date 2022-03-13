module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier',
    'eslint-plugin-prettier',
  ],
  rules: {
    'max-len': ['error', { code: 130 }],
    //'prettier/prettier:': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
