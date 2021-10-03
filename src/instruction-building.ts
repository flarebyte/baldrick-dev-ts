import { FileSearching, MicroInstruction } from './model';
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
  fileSearching: FileSearching,
  flags: string[]
): MicroInstruction[] => {
  return isSimpleLint(fileSearching)
    ? [
        {
          name: 'lint',
          params: {
            targetFiles: fileSearching.filtering.withPathStarting,
            extensions: fileSearching.filtering.withExtension,
            flags,
          },
        },
      ]
    : [
        {
          name: 'lint',
          params: {
            targetFiles: [],
            extensions: [],
            flags: ['globInputPaths:false', ...flags],
          },
        },
      ];
};
export const toLintInstructions = (
  fileSearching: FileSearching,
  flags: string[]
): MicroInstruction[] => {
  return [
    ...filesInstructions(fileSearching),
    ...loadInstructions(fileSearching),
    ...globInstructions(fileSearching),
    ...filterInstructions(fileSearching),
    ...configureLintInstructions(fileSearching, flags),
  ];
};
