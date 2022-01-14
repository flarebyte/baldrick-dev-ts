import { ensureDir } from 'fs-extra';
import fs, { readFile } from 'fs/promises';
import { remark } from 'remark';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import remarkLintListItemIndent from 'remark-lint-list-item-indent';
import remarkLintOrderedListMarkerValue from 'remark-lint-ordered-list-marker-value';
import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkLintMaximumLineLength from 'remark-lint-maximum-line-length';
import remarkLintMaximumHeadingLength from 'remark-lint-maximum-heading-length';
import remarkLintListItemSpacing from 'remark-lint-list-item-spacing';
import remarkLintStrongMarker from 'remark-lint-strong-marker';
import remarkLintEmphasisMarker from 'remark-lint-emphasis-marker';
import remarkLintUnorderedListMarkerStyle from 'remark-lint-unordered-list-marker-style';
import remarkLintOrderedListMarkerStyle from 'remark-lint-ordered-list-marker-style';

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

/**
 * @see https://github.com/codacy/codacy-remark-lint
 */
const createRemark = () =>
  remark()
    .use(remarkPresetLintConsistent)
    .use(remarkPresetLintRecommended)
    .use(remarkLintMaximumLineLength)
    .use(remarkLintMaximumHeadingLength)
    .use(remarkLintListItemIndent)
    .use(remarkLintOrderedListMarkerValue)
    .use(remarkLintListItemSpacing)
    .use(remarkLintStrongMarker, '*')
    .use(remarkLintEmphasisMarker, '_')
    .use(remarkLintUnorderedListMarkerStyle, '-')
    .use(remarkLintOrderedListMarkerStyle, '.')
    .use(remarkLintOrderedListMarkerValue, 'ordered');

const runMdRemarkOnFile =
  (opts: MarkdownResolvedOpts) => async (filename: string) => {
    const content = await readFile(filename, 'utf-8');
    await createRemark()
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

export const fixMdRemarkContent = async (content: string) => {
  const newContent = await createRemark()
    .data('settings', {
      commonmark: true,
      emphasis: '_',
      strong: '*',
      bullet: '-',
      listItemIndent: 'tab',
      incrementListMarker: true,
      fences: true,
    })
    .process(content);

  return String(newContent);
};
