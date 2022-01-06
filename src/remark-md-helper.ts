import { readFile } from 'fs/promises';
import { remark } from 'remark';
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide';
import { reporter } from 'vfile-reporter';
import { errorFormatter } from './term-formatter.js';

const fileLimits = 200;
const runMdRemarkOnFile = async (filename: string) => {
  const content = await readFile(filename, 'utf-8');
  await remark()
    .use(remarkPresetLintMarkdownStyleGuide)
    .process(content)
    .then(
      (file) => {
        errorFormatter({
          title: `Linting markdown failed for ${filename}`,
          detail: reporter(file),
        });
      },
      (error) => {
        throw error;
      }
    );
};

export const runMdRemark = async (filenames: string[]) => {
  if (filenames.length > fileLimits) {
    throw new Error(`Too many files to process: ${filenames.length}`);
  }
  if (filenames.length === 0) {
    throw new Error('You need at least one file to process');
  }

  const jobs = filenames.map(runMdRemarkOnFile);
  await Promise.all(jobs);
};
