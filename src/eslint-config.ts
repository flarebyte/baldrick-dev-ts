import { LintResolvedOpts, SupportedEcmaVersion } from './model.js';
import { ESLint, Linter } from 'eslint';

// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md

export const flagsToEcmaVersion = (flags: string[]): SupportedEcmaVersion => {
  if (flags.includes('ecma:2020')) {
    return 2020;
  }
  return 2021;
};

const defaultConfig = (ecmaVersion: SupportedEcmaVersion): Linter.Config => ({
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'jest', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:jest/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  settings: {},
  rules: {
    'prettier/prettier': 'error',
  },
});

export const computeEsLintConfig = (opts: LintResolvedOpts): ESLint.Options => {
  return {
    baseConfig: {
      ...defaultConfig(opts.ecmaVersion),
    },
    extensions: ['.ts', '.json'],
    fix: opts.mode === 'fix',
  };
};
