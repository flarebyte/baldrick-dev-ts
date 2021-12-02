import {
  BuildActionOpts,
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
  fileSearching.pathInfos.length === 0 && moreThanStartAndExt(fileSearching);

const shouldLoadFiles = (fileSearching: FileSearching): boolean =>
  fileSearching.pathInfos.some((p) => p.tags.includes('@load'));

const shouldFilter = (fileSearching: FileSearching): boolean =>
  (shouldGlob(fileSearching) || shouldLoadFiles(fileSearching)) &&
  moreThanStartAndExt(fileSearching);

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
  const targetFiles = fileSearching.filtering.withPathStarting.map(
    (p) => `${p}**/*`
  );
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
            flags: opts.flags,
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
            flags: ['globInputPaths:false', ...opts.flags],
          },
        },
      ];
};

const configureTestInstructions = (
  opts: TestActionOpts
): MicroInstruction[] => {
  return isSimpleLint(opts.fileSearching)
    ? [
        {
          name: 'test',
          params: {
            targetFiles: opts.fileSearching.filtering.withPathStarting,
            extensions: opts.fileSearching.filtering.withExtension,
            reportBase: opts.reportBase,
            displayName: opts.displayName,
            flags: opts.flags,
          },
        },
      ]
    : [
        {
          name: 'test',
          params: {
            targetFiles: [],
            extensions: [],
            reportBase: opts.reportBase,
            displayName: opts.displayName,
            flags: ['globInputPaths:false', ...opts.flags],
          },
        },
      ];
};

const configureBuildInstructions = (
  opts: BuildActionOpts
): MicroInstruction[] => {
  return isSimpleLint(opts.fileSearching)
    ? [
        {
          name: 'build',
          params: {
            targetFiles: opts.fileSearching.filtering.withPathStarting,
            extensions: opts.fileSearching.filtering.withExtension,
            reportBase: opts.reportBase,
            flags: opts.flags,
          },
        },
      ]
    : [
        {
          name: 'build',
          params: {
            targetFiles: [],
            extensions: [],
            reportBase: opts.reportBase,
            flags: ['globInputPaths:false', ...opts.flags],
          },
        },
      ];
};
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
  return [
    ...filesInstructions(opts.fileSearching),
    ...loadInstructions(opts.fileSearching),
    ...globInstructions(opts.fileSearching),
    ...filterInstructions(opts.fileSearching),
    ...configureTestInstructions(opts),
  ];
};

export const toBuildInstructions = (
  opts: BuildActionOpts
): MicroInstruction[] => {
  return [
    ...filesInstructions(opts.fileSearching),
    ...loadInstructions(opts.fileSearching),
    ...globInstructions(opts.fileSearching),
    ...filterInstructions(opts.fileSearching),
    ...configureBuildInstructions(opts),
  ];
};
