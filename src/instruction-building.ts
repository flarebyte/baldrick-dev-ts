import {
  MarkdownActionOpts,
  FileSearching,
  LintActionOpts,
  MicroInstruction,
  TestActionOpts,
} from './model.js';
import { byFileQuery, filteringToCommanderStrings } from './path-filtering.js';

const moreThanStartAndExt = (fileSearching: FileSearching): boolean =>
  fileSearching.filtering.withPathSegment.length +
    fileSearching.filtering.withTag.length +
    fileSearching.filtering.withTagStarting.length +
    fileSearching.filtering.withoutExtension.length +
    fileSearching.filtering.withoutPathSegment.length +
    fileSearching.filtering.withoutPathStarting.length +
    fileSearching.filtering.withoutTag.length +
    fileSearching.filtering.withoutTagStarting.length >
  0;

const isSimpleLint = (fileSearching: FileSearching): boolean =>
  fileSearching.pathInfos.length === 0 && !moreThanStartAndExt(fileSearching);

const shouldGlob = (fileSearching: FileSearching): boolean =>
  fileSearching.useGlob === 'yes' ||
  (fileSearching.pathInfos.length === 0 && moreThanStartAndExt(fileSearching));

const shouldLoadFiles = (fileSearching: FileSearching): boolean =>
  fileSearching.pathInfos.some((p) => p.tags.includes('@load'));

const shouldFilter = (fileSearching: FileSearching): boolean =>
  shouldGlob(fileSearching) || shouldLoadFiles(fileSearching);

const loadInstructions = (fileSearching: FileSearching): MicroInstruction[] => {
  const targetFiles = fileSearching.pathInfos
    .filter((pathInfo) => pathInfo.tags.includes('@load'))
    .map((pathInfo) => pathInfo.path);
  return targetFiles.length === 0
    ? []
    : [
        {
          name: 'load',
          params: {
            targetFiles,
          },
        },
      ];
};
const filesInstructions = (
  fileSearching: FileSearching
): MicroInstruction[] => {
  const targetFiles = fileSearching.pathInfos
    .filter((pathInfo) => !pathInfo.tags.includes('@load'))
    .filter(byFileQuery(fileSearching.filtering))
    .map((pathInfo) => pathInfo.path);
  return targetFiles.length === 0
    ? []
    : [
        {
          name: 'files',
          params: {
            targetFiles,
          },
        },
      ];
};
const globInstructions = (fileSearching: FileSearching): MicroInstruction[] => {
  const targetFiles =
    fileSearching.filtering.withPathStarting.length === 0
      ? ['*']
      : fileSearching.filtering.withPathStarting.map((p) => `${p}**/*`);
  return shouldGlob(fileSearching)
    ? [
        {
          name: 'glob',
          params: {
            targetFiles,
          },
        },
      ]
    : [];
};
const filterInstructions = (
  fileSearching: FileSearching
): MicroInstruction[] => {
  return shouldFilter(fileSearching)
    ? [
        {
          name: 'filter',
          params: {
            query: filteringToCommanderStrings(fileSearching.filtering),
          },
        },
      ]
    : [];
};
const configureLintInstructions = (
  opts: LintActionOpts
): MicroInstruction[] => {
  return isSimpleLint(opts.fileSearching)
    ? [
        {
          name: 'lint',
          params: {
            targetFiles: opts.fileSearching.filtering.withPathStarting,
            extensions: opts.fileSearching.filtering.withExtension,
            reportBase: opts.reportBase,
            reportDirectory: opts.reportDirectory,
            reportPrefix: opts.reportPrefix,
            flags: opts.flags,
            ecmaVersion: opts.ecmaVersion,
          },
        },
      ]
    : [
        {
          name: 'lint',
          params: {
            targetFiles: [],
            extensions: [],
            reportBase: opts.reportBase,
            reportDirectory: opts.reportDirectory,
            reportPrefix: opts.reportPrefix,
            flags: ['globInputPaths:false', ...opts.flags],
            ecmaVersion: opts.ecmaVersion,
          },
        },
      ];
};

const configureTestInstructions = (
  opts: TestActionOpts
): MicroInstruction[] => [
  {
    name: 'test',
    params: {
      targetFiles: opts.fileSearching.filtering.withPathStarting,
      reportBase: opts.reportBase,
      reportDirectory: opts.reportDirectory,
      reportPrefix: opts.reportPrefix,
      displayName: opts.displayName,
      flags: opts.flags,
    },
  },
];
const configureMarkdownInstructions = (
  opts: MarkdownActionOpts
): MicroInstruction[] => [
  {
    name: 'markdown',
    params: {
      reportBase: opts.reportBase,
      reportDirectory: opts.reportDirectory,
      reportPrefix: opts.reportPrefix,
      flags: opts.flags,
    },
  },
];
export const toLintInstructions = (
  opts: LintActionOpts
): MicroInstruction[] => {
  return [
    ...filesInstructions(opts.fileSearching),
    ...loadInstructions(opts.fileSearching),
    ...globInstructions(opts.fileSearching),
    ...filterInstructions(opts.fileSearching),
    ...configureLintInstructions(opts),
  ];
};

export const toTestInstructions = (
  opts: TestActionOpts
): MicroInstruction[] => {
  return [...configureTestInstructions(opts)];
};

export const toMarkdownInstructions = (
  opts: MarkdownActionOpts
): MicroInstruction[] => {
  return [
    ...filesInstructions(opts.fileSearching),
    ...loadInstructions(opts.fileSearching),
    ...globInstructions(opts.fileSearching),
    ...filterInstructions(opts.fileSearching),
    ...configureMarkdownInstructions(opts),
  ];
};
