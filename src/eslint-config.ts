import { LintResolvedOpts, SupportedEcmaVersion } from './model.js';
import { ESLint, Linter } from 'eslint';
import { satisfyFlag } from './flag-helper.js';

// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md

const defaultConfig = (ecmaVersion: SupportedEcmaVersion): Linter.Config => ({
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'jest', 'import', 'unicorn'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:jest/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
  ],
  settings: {},
  rules: {
    'prettier/prettier': 'error',
    'import/no-unresolved': [2, { ignore: ['.js$'] }],
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-array-callback-reference': 'off', // Typescript would raise an issue in these cases
    'unicorn/prefer-json-parse-buffer': 'off', // Typescript seems to expect a string for parse
  },
});

export const computeEsLintConfig = (opts: LintResolvedOpts): ESLint.Options => {
  return {
    baseConfig: {
      ...defaultConfig(opts.ecmaVersion),
    },
    extensions: ['.ts', '.mts', '.json'],
    fix: satisfyFlag('aim:fix', opts.flags),
  };
};
