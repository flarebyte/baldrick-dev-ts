import { computeEsLintConfig } from './eslint-config';
import { LintResolvedOpts } from './model';
import { ESLint } from 'eslint';
import path from 'path';

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
  const formatter = await eslint.loadFormatter('stylish');
  const jsonFormatter = await eslint.loadFormatter('json');
  return { eslint, opts, options, formatter, jsonFormatter };
};

export const lintCommand = async (
  handle: ESLintHandle
): Promise<ESLint.LintResult[]> => {
  const patterns = handle.opts.pathPatterns.map((pathPattern) =>
    path.join(handle.opts.modulePath, pathPattern)
  );
  return await handle.eslint.lintFiles(patterns);
};
