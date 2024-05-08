module.exports = {
  root: true,
  extends: [
    'plugin:security/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
    'plugin:import/recommended',
    'plugin:react-hooks/recommended',
    // 'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'jsx-a11y',
    'react',
    'react-hooks',
    'security',
    'prettier',
  ],
  rules: {
    indent: 0,
    // 'no-console': ['error'],
    'no-console': 'off',
    'no-undef': 0,
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
    '@typescript-eslint/ban-ts-comment': 1,
    'no-shadow': 0,
    // JSX-a11y
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['a'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
    // React
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 1,
    'react/forbid-prop-types': [
      1,
      { forbid: ['any', 'object'], ignore: ['style', 'data', 'variables'] },
    ],
    'react/static-property-placement': 1,
    'react/function-component-definition': 0,
    'react/jsx-key': [
      1,
      { checkFragmentShorthand: true, warnOnDuplicates: true },
    ],
    'react/jsx-wrap-multilines': 1,
    'react/jsx-fragments': 0,
    'react/jsx-props-no-spreading': [1, { custom: 'ignore' }],
    'react/destructuring-assignment': 1,
    'react/jsx-curly-newline': 0, // Not compatible with prettier
    'react/prop-types': [
      1,
      {
        ignore: [
          // `dispatch` is typically used by Redux `@connect`
          'dispatch',
          // `data` is injected by Apollo
          'data',
          // default "style" prop could be unshaped objected
          'style',
          // `variables` is used for GraphQL queries
          'variables',
        ],
        skipUndeclared: true,
      },
    ],
    'react/jsx-no-bind': [
      1,
      {
        ignoreDOMComponents: false,
        ignoreRefs: false,
        allowArrowFunctions: false,
        allowFunctions: false,
        allowBind: false,
      },
    ],
    'react/jsx-closing-bracket-location': [
      1,
      {
        selfClosing: 'tag-aligned',
        nonEmpty: 'after-props',
      },
    ],
    'react/jsx-one-expression-per-line': [0, { allow: 'single-child' }],
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.jsx', '.ts', '.tsx'] },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src', 'node_modules'],
        extensions: ['.js', '.ts', '.d.ts', '.jsx', '.tsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
  globals: {
    JSX: true,
    figma: true,
    __html__: true,
  },
};
