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
    // Dev-only HMR hint. Off because every section is exported through the
    // `SectionWrapper` HOC (an anonymous component export) and several files
    // intentionally co-locate small helper constants/hooks with their component.
    'react-refresh/only-export-components': 'off',
    // Project does not use PropTypes; relying on TS/author discipline
    'react/prop-types': 'off',
    // Ignore unused React import (automatic JSX runtime)
    'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true, varsIgnorePattern: '^React$' }],
    // Allow mixing spaces and tabs for legacy files (visual output unaffected)
    'no-mixed-spaces-and-tabs': 'off',
  },
  overrides: [
    {
      // React Three Fiber components use non-DOM JSX props (position, args,
      // geometry, intensity, …) that this DOM-oriented rule flags as unknown.
      files: ['src/components/canvas/**/*.{js,jsx}', 'src/components/BoosterBox3D.jsx'],
      rules: {
        'react/no-unknown-property': 'off',
      },
    },
  ],
}
