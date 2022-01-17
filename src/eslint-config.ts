import {
  LintResolvedOpts,
  SupportedEcmaVersion,
  SupportedFlag,
} from './model.js';
import { ESLint, Linter } from 'eslint';
import { satisfyFlag } from './flag-helper.js';

// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md

const isPureFunctionalProgramming = (flags: SupportedFlag[]): boolean =>
  flags.includes('paradigm:fp');

const defaultConfig = (
  ecmaVersion: SupportedEcmaVersion,
  flags: SupportedFlag[]
): Linter.Config => ({
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
    'unicorn/no-array-reduce': isPureFunctionalProgramming(flags)
      ? 'off'
      : 'error',
  },
});

export const computeEsLintConfig = (opts: LintResolvedOpts): ESLint.Options => {
  return {
    baseConfig: {
      ...defaultConfig(opts.ecmaVersion, opts.flags),
    },
    extensions: ['.ts', '.mts', '.json'],
    fix: satisfyFlag('aim:fix', opts.flags),
  };
};
