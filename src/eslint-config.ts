import { LintOpts, PackageJson } from "./model";

const defaultConfig = {
    extends: [
      'prettier/@typescript-eslint',
      'plugin:prettier/recommended',
    ],
    settings: {
    },
  };

export const computeEsLintConfig = (appPackageJson: PackageJson, opts: LintOpts) => {
    return {
        baseConfig: {
          ...defaultConfig,
          ...appPackageJson.eslint,
        },
        extensions: [".ts", ".tsx"],
        fix: opts.fix,
        ignorePattern: opts["ignore-pattern"],
      }
}