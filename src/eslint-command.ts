import { computeEsLintConfig } from "./eslint-config";
import { LintResolvedOpts } from "./model";
import { ESLint } from "eslint";

interface ESLintHandle {
  eslint: ESLint;
  opts: LintResolvedOpts;
  options: ESLint.Options;
  formatter: ESLint.Formatter;
}

export const createESLint = async (
  opts: LintResolvedOpts
): Promise<ESLintHandle> => {
  const options = computeEsLintConfig(opts);
  const eslint = new ESLint(options);
  const formatter = await eslint.loadFormatter("stylish");
  return { eslint, opts, options, formatter };
};

export const lintCommand = async (
  handle: ESLintHandle
): Promise<ESLint.LintResult[]> => {
  const files = handle.opts.folders.map(
    (folder) => `${handle.opts.modulePath}/${folder}/**/*.ts`
  );
  return await handle.eslint.lintFiles(files);
};
