import { FileFiltering, FileSearching, MicroInstruction } from './model';
import { byFileQuery, filteringToCommanderStrings } from './path-filtering';

const preferGlob = (fileSearching: FileSearching): boolean =>
  fileSearching.pathInfos.length === 0 &&
  fileSearching.filtering.withPathStarting.length > 0 &&
  (fileSearching.filtering.withPathSegment.length > 0 ||
    fileSearching.filtering.withoutPathStarting.length > 0 ||
    fileSearching.filtering.withoutPathSegment.length > 0 ||
    fileSearching.filtering.withoutExtension.length > 0);

const shouldFilter = (fileSearching: FileSearching): boolean =>
  fileSearching.filtering.withPathSegment.length > 0 ||
  fileSearching.filtering.withTag.length > 0 ||
  fileSearching.filtering.withTagStarting.length > 0 ||
  fileSearching.filtering.withoutExtension.length > 0 ||
  fileSearching.filtering.withoutPathSegment.length > 0 ||
  fileSearching.filtering.withoutPathStarting.length > 0 ||
  fileSearching.filtering.withoutTag.length > 0 ||
  fileSearching.filtering.withoutTagStarting.length > 0;

const isSimpleLint = (fileSearching: FileSearching): boolean =>
  !(preferGlob(fileSearching) || shouldFilter(fileSearching));

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
  return preferGlob(fileSearching)
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
  const {
    withPathSegment,
    withTag,
    withTagStarting,
    withoutExtension,
    withoutPathSegment,
    withoutPathStarting,
    withoutTag,
    withoutTagStarting,
  } = fileSearching.filtering;
  const queryFilter: FileFiltering = {
    withPathStarting: [],
    withExtension: [],
    withPathSegment,
    withTag,
    withTagStarting,
    withoutExtension,
    withoutPathSegment,
    withoutPathStarting,
    withoutTag,
    withoutTagStarting,
  };
  return shouldFilter(fileSearching)
    ? [
        {
          name: 'filter',
          params: {
            query: filteringToCommanderStrings(queryFilter),
          },
        },
      ]
    : [];
};
const configureLintInstructions = (
  fileSearching: FileSearching
): MicroInstruction[] => {
  return isSimpleLint(fileSearching)
    ? [
        {
          name: 'lint',
          params: {
            targetFiles: fileSearching.filtering.withPathStarting,
            extensions: fileSearching.filtering.withExtension,
            flags: [],
          },
        },
      ]
    : [
        {
          name: 'lint',
          params: {
            targetFiles: [],
            extensions: [],
            flags: ['globInputPaths:false'],
          },
        },
      ];
};
export const toLintInstructions = (
  fileSearching: FileSearching
): MicroInstruction[] => {
  // const { pathInfos, filtering } = fileSearching;
  return [
    ...filesInstructions(fileSearching),
    ...loadInstructions(fileSearching),
    ...globInstructions(fileSearching),
    ...filterInstructions(fileSearching),
    ...configureLintInstructions(fileSearching),
  ];
};
