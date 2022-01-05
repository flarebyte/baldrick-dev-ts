import { format, Options } from 'prettier';
import { computePrettierMdConfig } from './prettier-md-config.js';
import { readFile, writeFile } from 'fs/promises';
const fileLimits = 200;
const runMdPrettierOnFile =
  (prettierOpts: Options) => async (filename: string) => {
    const content = await readFile(filename, 'utf-8');
    const formatted = format(content, prettierOpts);
    writeFile(filename, formatted, 'utf-8');
  };

export const runMdPrettier = async (filenames: string[]) => {
  if (filenames.length > fileLimits) {
    throw new Error(`Too many files to process: ${filenames.length}`);
  }
  if (filenames.length === 0) {
    throw new Error('You need at least one file to process');
  }
  const prettierConfig = computePrettierMdConfig();
  const jobs = filenames.map(runMdPrettierOnFile(prettierConfig));
  await Promise.all(jobs);
};
