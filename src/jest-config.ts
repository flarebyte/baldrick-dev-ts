import { Config } from '@jest/types';
import { TestResolvedOpts } from './model.js';
import path from 'path';

type JestConfigOptions = Partial<Config.InitialOptions>;

export const computeJestConfig = (opts: TestResolvedOpts) => {
  const jestUnitReport: Config.ReporterConfig = [
    'jest-junit',
    {
      outputDirectory: opts.outputDirectory,
      outputName: `${opts.outputName}-junit.xml`,
    },
  ];
  const ciReporters = opts.mode === 'ci' ? [jestUnitReport] : [];
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
    collectCoverage: opts.mode === 'cov' || opts.mode === 'ci',
    coverageDirectory: path.join(
      opts.outputDirectory,
      'coverage',
      opts.outputName
    ),
    ci: opts.mode === 'ci',
    reporters,
    coverageReporters: ['json', 'json-summary', 'lcov', 'text'],
    displayName: opts.displayName,
    testPathIgnorePatterns: ['/node_modules/', 'dist/']
  };
  return config;
};
