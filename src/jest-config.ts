import { Config } from '@jest/types';
import { TestResolvedOpts } from './model';
import path from 'path'

type JestConfigOptions = Partial<Config.InitialOptions>;

export const computeJestConfig = (opts: TestResolvedOpts) => {
  const jestUnitReport: Config.ReporterConfig = [
    'jest-junit',
    { outputDirectory: opts.outputDirectory, outputName: opts.outputName },
  ];
  const ciReporters = opts.mode === 'ci' ? [jestUnitReport] : [];
  const reporters = ['default', ...ciReporters];
  const config: JestConfigOptions = {
    preset: 'ts-jest',
    collectCoverage: opts.mode === 'cov' || opts.mode === 'ci',
    coverageDirectory: path.join(opts.outputDirectory, 'coverage', opts.outputName),
    ci: opts.mode === 'ci',
    reporters,
    displayName: opts.displayName
  };
  return config;
};
