import { computeJestConfig } from './jest-config';
import { TestResolvedOpts } from './model';
import jest from 'jest';

export interface JestHandle {
  config: object;
  argv: string[];
}

export const createJest = (opts: TestResolvedOpts): JestHandle => {
  const jestConfig = computeJestConfig(opts);

  const config = JSON.stringify({ ...jestConfig });
  const cfgArg = ['--config', config];
  // const ciArg = opts.mode === 'ci' ? ['--ci', '--reporters=default', '--reporters=jest-junit']: []
  const argv = [...cfgArg]
  return { config: jestConfig, argv };
};

export const jestCommand = async (handle: JestHandle): Promise<void> => {
  // Do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = 'test';
  process.env.NODE_ENV = 'test';

  // Makes the script crash on unhandled rejections instead of silently
  // ignoring them. In the future, promise rejections that are not handled will
  // terminate the Node.js process with a non-zero exit code.
  process.on('unhandledRejection', (err) => {
    console.error(err)
    throw err;
  });

  jest.run(handle.argv);
};