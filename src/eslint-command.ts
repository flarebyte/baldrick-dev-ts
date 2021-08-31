import { computeEsLintConfig } from "./eslint-config";
import { LintResolvedOpts } from "./model";
import { ESLint } from "eslint";

export interface ESLintHandle {
  eslint: ESLint;
  opts: LintResolvedOpts;
  options: ESLint.Options;
  formatter: ESLint.Formatter;
  jsonFormatter: ESLint.Formatter;
}

export const createESLint = async (
  opts: LintResolvedOpts
): Promise<ESLintHandle> => {
  const options = computeEsLintConfig(opts);
  const eslint = new ESLint(options);
  const formatter = await eslint.loadFormatter("stylish");
  const jsonFormatter = await eslint.loadFormatter("json");
  return { eslint, opts, options, formatter, jsonFormatter };
};

export const lintCommand = async (
  handle: ESLintHandle
): Promise<ESLint.LintResult[]> => {
  const files = handle.opts.folders.map(
    (folder) => `${handle.opts.modulePath}/${folder}/**/*.ts`
  );
  return await handle.eslint.lintFiles(files);
};
