module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // project specific relaxations
    '@typescript-eslint/no-explicit-any': 'off',
    // Allow legacy CommonJS require() usage in mixed JS/TS backend files
    '@typescript-eslint/no-var-requires': 'off',
    // Prefer warnings for unused vars to avoid failing CI during scaffold
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }]
  }
}
