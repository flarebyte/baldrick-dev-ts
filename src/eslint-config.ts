import { LintOpts, LocalSetup } from "./model";

const defaultConfig = {
    extends: [
      'prettier/@typescript-eslint',
      'plugin:prettier/recommended',
    ],
    settings: {
    },
  };

export const computeEsLintConfig = (localSetup: LocalSetup, opts: LintOpts) => {
    return {
        baseConfig: {
          ...defaultConfig,
        },
        extensions: [".ts", ".tsx"],
        fix: opts.fix,
        ignorePattern: localSetup.toolOptions.linting.ignore,
      }
}