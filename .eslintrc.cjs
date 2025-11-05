module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    // Project does not use PropTypes; relying on TS/author discipline
    'react/prop-types': 'off',
    // Ignore unused React import (automatic JSX runtime)
    'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true, varsIgnorePattern: '^React$' }],
    // Allow mixing spaces and tabs for legacy files (visual output unaffected)
    'no-mixed-spaces-and-tabs': 'off',
  },
  overrides: [
    {
      files: ['src/components/canvas/**/*.{js,jsx}'],
      rules: {
        // Three.js in R3F uses non-DOM JSX props like position, args, etc.
        'react/no-unknown-property': 'off',
      },
    },
  ],
}
