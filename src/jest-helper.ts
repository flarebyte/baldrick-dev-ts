import { computeJestConfig } from './jest-config.js';
import { TestResolvedOpts } from './model.js';
import jest from 'jest'; // eslint-disable-line jest/no-jest-import
import { satisfyFlag } from './flag-helper.js';

export interface JestHandle {
  config: object;
  argv: string[];
}

export const createJest = (opts: TestResolvedOpts): JestHandle => {
  const jestConfig = computeJestConfig(opts);

  const config = JSON.stringify({ ...jestConfig });
  const cfgArg = ['--config', config];
  const updateSnapshot = satisfyFlag('aim:fix', opts.flags)
    ? ['--updateSnapshot']
    : [];
  const argv = [...cfgArg, ...updateSnapshot];
  return { config: jestConfig, argv };
};

export const jestCommand = async (handle: JestHandle): Promise<void> => {
  // Do this as the first thing so that any code reading it knows the right env.
  process.env['BABEL_ENV'] = 'test';
  process.env['NODE_ENV'] = 'test';
  process.env['NODE_OPTIONS'] = '--experimental-vm-modules';

  // Makes the script crash on unhandled rejections instead of silently
  // ignoring them. In the future, promise rejections that are not handled will
  // terminate the Node.js process with a non-zero exit code.
  process.on('unhandledRejection', (err) => {
    console.error(err);
    throw err;
  });

  jest.run(handle.argv);
};
