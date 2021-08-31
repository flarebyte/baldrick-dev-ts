import { LintOpts, LocalSetup } from "./model";
import { ESLint } from "eslint";

// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md

const defaultConfig = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  settings: {},
};

export const computeEsLintConfig = (
  _localSetup: LocalSetup,
  opts: LintOpts
): ESLint.Options => {
  return {
    baseConfig: {
      ...defaultConfig,
    },
    extensions: [".ts", ".tsx"],
    fix: opts.fix,
  };
};
