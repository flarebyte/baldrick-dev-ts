import { computeEsLintConfig } from "./eslint-config";
import { LintOpts, LocalSetup } from "./model";
import { ESLint } from "eslint";

export const eslintCommand = (localSetup: LocalSetup) => async (opts: LintOpts) => {
  const cliConfig = computeEsLintConfig(localSetup, opts);
  console.log('>>>ignore', cliConfig)
  const eslint = new ESLint();
  const results = await eslint.lintFiles([`${localSetup.modulePath}/src/**/*.ts`, `${localSetup.modulePath}/test/**/*.ts`]);
  console.log('>>>', results)
};
