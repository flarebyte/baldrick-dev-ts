import { FileSearching, LintActionOpts, MicroInstruction } from './model';
import { byFileQuery, filteringToCommanderStrings } from './path-filtering';

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
