import { computeEsLintConfig } from './eslint-config.js';
import { LintResolvedOpts } from './model.js';
import { ESLint } from 'eslint';
import path from 'path';

export interface ESLintHandle {
  eslint: ESLint;
  opts: LintResolvedOpts;
  options: ESLint.Options;
  formatter: ESLint.Formatter;
  jsonFormatter: ESLint.Formatter;
  junitFormatter: ESLint.Formatter;
  compactFormatter: ESLint.Formatter;
}

export const createESLint = async (
  opts: LintResolvedOpts
): Promise<ESLintHandle> => {
  const options = computeEsLintConfig(opts);
  const eslint = new ESLint(options);
  const formatter = await eslint.loadFormatter('stylish');
  const jsonFormatter = await eslint.loadFormatter('json');
  const junitFormatter = await eslint.loadFormatter('junit');
  const compactFormatter = await eslint.loadFormatter('compact');
  return {
    eslint,
    opts,
    options,
    formatter,
    jsonFormatter,
    junitFormatter,
    compactFormatter,
  };
};

export const lintCommand = async (
  handle: ESLintHandle,
  fix: boolean
): Promise<ESLint.LintResult[]> => {
  const patterns = handle.opts.pathPatterns.map((pathPattern) =>
    path.join(handle.opts.modulePath, pathPattern)
  );
  const results = await handle.eslint.lintFiles(patterns);
  if (fix) {
    await ESLint.outputFixes(results);
  }
  return results;
};
