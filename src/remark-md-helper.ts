import { ensureDir } from 'fs-extra';
import fs, { readFile } from 'fs/promises';
import { remark } from 'remark';
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide';
import { reporter } from 'vfile-reporter';
import { MarkdownResolvedOpts } from './model.js';
import { errorFormatter } from './term-formatter.js';
import { VFile } from 'vfile';
import { reporterJson } from 'vfile-reporter-json';
import path from 'path';

const filesLimit = 200;

const formatWarnings = (filename: string, vfile: VFile) => {
  errorFormatter({
    title: `Linting markdown failed for ${filename}`,
    detail: '\n' + reporter(vfile),
  });
};

const formatJsonWarnings = async (opts: MarkdownResolvedOpts, vfile: VFile) => {
  const content = reporterJson(vfile);
  const pathName = path.join(
    opts.outputDirectory,
    `${opts.outputName}-remark.json`
  );
  const singleLineJson = JSON.stringify(JSON.parse(content)) + '\n';
  await fs.appendFile(pathName, singleLineJson);
};

const runMdRemarkOnFile =
  (opts: MarkdownResolvedOpts) => async (filename: string) => {
    const content = await readFile(filename, 'utf-8');
    await remark()
      .use(remarkPresetLintMarkdownStyleGuide)
      .process(content)
      .then(
        async (file) => {
          file.basename = path.basename(filename);
          formatWarnings(filename, file);
          await formatJsonWarnings(opts, file);
        },
        (error) => {
          throw error;
        }
      );
  };

export const runMdRemark = async (
  opts: MarkdownResolvedOpts,
  filenames: string[]
) => {
  if (filenames.length > filesLimit) {
    throw new Error(`Too many files to process: ${filenames.length}`);
  }
  if (filenames.length === 0) {
    throw new Error('You need at least one file to process');
  }

  await ensureDir(opts.outputDirectory);

  const jobs = filenames.map(runMdRemarkOnFile(opts));
  await Promise.all(jobs);
};
