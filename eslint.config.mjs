import config from '@rsamuel1993/eslint-config-node';
import parser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    ignores: ['docker-compose.yml'],
  },

  ...config,

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
];
