import { LintResolvedOpts } from './model';
import { ESLint, Linter } from 'eslint';

// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md

const defaultConfig: Linter.Config = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
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
};

export const computeEsLintConfig = (opts: LintResolvedOpts): ESLint.Options => {
  return {
    baseConfig: {
      ...defaultConfig,
    },
    extensions: ['.ts', '.json'],
    fix: opts.mode === 'fix',
  };
};
