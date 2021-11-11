import { Config } from '@jest/types';
import { TestResolvedOpts } from './model';

type JestConfigOptions = Partial<Config.InitialOptions>;

export const computeJestConfig = (opts: TestResolvedOpts) => {
  const config: JestConfigOptions = {
    preset: 'ts-jest',
    collectCoverage: opts.mode === 'cov'
  };
  return config;
};
