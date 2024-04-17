module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'prettier', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.],
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    jsx: true,
  },
  env: {
    node: true,
  },
  plugins: ['import', 'prettier'],
  rules: {
    indent: 0,
    'no-console': 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': [1, { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    'max-len': [
      1,
      {
        code: 80,
        tabWidth: 2,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'no-else-return': 1,
    'no-shadow': 0,
    'arrow-parens': 'off', // Not compatible with prettier
    'no-mixed-operators': 'off', // Not compatible with prettier
    'object-curly-newline': 'off', // Not compatible with prettier
    'space-before-function-paren': 0, // Not compatible with prettier
    'operator-linebreak': 0, // Not compatible with prettier
    'implicit-arrow-linebreak': 0, // Not compatible with prettier
    'function-paren-newline': 0,
    'react/require-default-props': 0,
    'import/no-named-as-default-member': 0,
    'import/no-named-as-default': 0,
    'import/named': 0,
    'import/extensions': [
      2,
      {
        js: 'never',
        jsx: 'never',
        tsx: 'never',
        ts: 'never',
      },
    ],
    'prettier/prettier': 2,
    'lines-between-class-members': 0,
    'max-classes-per-file': 0,
    'prefer-object-spread': 1,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src', 'node_modules'],
        extensions: ['.js', '.ts'],
      },
    },
  },
  globals: {
    DEBUG: false,
  },
};
