import { Config } from '@jest/types';
import { TestResolvedOpts } from './model.js';
import path from 'path';
import { satisfyFlag } from './flag-helper.js';

type JestConfigOptions = Partial<Config.InitialOptions>;
/**
 * Provide a standardized jest config
 * @see https://github.com/facebook/jest/blob/64de4d7361367fd711a231d25c37f3be89564264/docs/ECMAScriptModules.md
 * @param opts
 * @returns
 */
export const computeJestConfig = (opts: TestResolvedOpts) => {
  const jestUnitReport: Config.ReporterConfig = [
    'jest-junit',
    {
      outputDirectory: opts.outputDirectory,
      outputName: `${opts.outputName}-junit.xml`,
    },
  ];
  const ciReporters = satisfyFlag('aim:ci', opts.flags) ? [jestUnitReport] : [];
  const reporters = ['default', ...ciReporters];
  const config: JestConfigOptions = {
    preset: 'ts-jest/presets/default-esm',
    globals: {
      'ts-jest': {
        useESM: true,
      },
    },
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    collectCoverage:
      satisfyFlag('aim:cov', opts.flags) || satisfyFlag('aim:ci', opts.flags),
    coverageDirectory: path.join(
      opts.outputDirectory,
      'coverage',
      opts.outputName
    ),
    ci: satisfyFlag('aim:ci', opts.flags),
    reporters,
    coverageReporters: ['json', 'json-summary', 'lcov', 'text'],
    displayName: opts.displayName,
    testPathIgnorePatterns: ['/node_modules/', 'dist/'],
    transform: {},
  };
  return config;
};
