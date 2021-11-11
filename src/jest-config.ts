import { Config } from '@jest/types';
import { TestResolvedOpts } from './model';

type JestConfigOptions = Partial<Config.InitialOptions>;

export const computeJestConfig = (opts: TestResolvedOpts) => {
  const jestUnitReport: Config.ReporterConfig = [
    'jest-junit',
    { outputDirectory: 'report' },
  ];
  const ciReporters = opts.mode === 'ci' ? [jestUnitReport] : [];
  const reporters = ['default', ...ciReporters];
  const config: JestConfigOptions = {
    preset: 'ts-jest',
    collectCoverage: opts.mode === 'cov',
    ci: opts.mode === 'ci',
    reporters,
  };
  return config;
};
