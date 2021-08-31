import { LintResolvedOpts } from "./model";
import { ESLint } from "eslint";

// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md

const defaultConfig = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:jest/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  settings: {},
};

export const computeEsLintConfig = (opts: LintResolvedOpts): ESLint.Options => {
  return {
    baseConfig: {
      ...defaultConfig,
    },
    extensions: [".ts", ".tsx"],
    fix: opts.mode === "fix",
  };
};
