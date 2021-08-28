import { resolveApp } from './resolve-app'

export const paths = {
    appPackageJson: resolveApp('package.json'),
    tsconfigJson: resolveApp('tsconfig.json'),
    appRoot: resolveApp('.'),
    appDist: resolveApp('dist'),
    appConfig: resolveApp('tsdx.config.js'),
    jestConfig: resolveApp('jest.config.js'),
  };