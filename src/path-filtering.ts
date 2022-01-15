import { FileFiltering, PathInfo, CmdOption } from './model.js';
import { cmdLintFilterOptions } from './commanding-data.js';

export const emptyFileFiltering: FileFiltering = {
  withPathStarting: [],
  withoutPathStarting: [],
  withExtension: [],
  withoutExtension: [],
  withPathSegment: [],
  withoutPathSegment: [],
  withTag: [],
  withoutTag: [],
  withTagStarting: [],
  withoutTagStarting: [],
};

export const byFileQuery =
  (query: FileFiltering) =>
  (pathInfo: PathInfo): boolean => {
    const noWithFilter =
      query.withPathStarting.length +
        query.withExtension.length +
        query.withPathSegment.length +
        query.withTag.length +
        query.withTagStarting.length ===
      0;
    return (
      (noWithFilter ||
        query.withPathStarting.some((start) =>
          pathInfo.path.startsWith(start)
        ) ||
        query.withExtension.some((ext) => pathInfo.path.endsWith(ext)) ||
        query.withPathSegment.some((segment) =>
          pathInfo.path.includes(segment)
        ) ||
        query.withTag.some((tag) => pathInfo.tags.includes(tag)) ||
        query.withTagStarting.some((start) =>
          pathInfo.tags.some((tag) => tag.startsWith(start))
        )) &&
      !(
        query.withoutPathStarting.some((start) =>
          pathInfo.path.startsWith(start)
        ) ||
        query.withoutExtension.some((ext) => pathInfo.path.endsWith(ext)) ||
        query.withoutPathSegment.some((segment) =>
          pathInfo.path.includes(segment)
        ) ||
        query.withoutTag.some((tag) => pathInfo.tags.includes(tag)) ||
        query.withoutTagStarting.some((start) =>
          pathInfo.tags.some((tag) => tag.startsWith(start))
        )
      )
    );
  };

const optionOrEmpty = (option: CmdOption, values: string[]): string[] =>
  values.length === 0 ? [] : [`--${option.longFlag}`, ...values];

export const filteringToCommanderStrings = (
  filtering: FileFiltering
): string[] => {
  const withPathStarting = optionOrEmpty(
    cmdLintFilterOptions.withPathStarting,
    filtering.withPathStarting
  );
  const withoutPathStarting = optionOrEmpty(
    cmdLintFilterOptions.withoutPathStarting,
    filtering.withoutPathStarting
  );
  const withExtension = optionOrEmpty(
    cmdLintFilterOptions.withExtension,
    filtering.withExtension
  );
  const withoutExtension = optionOrEmpty(
    cmdLintFilterOptions.withoutExtension,
    filtering.withoutExtension
  );
  const withPathSegment = optionOrEmpty(
    cmdLintFilterOptions.withPathSegment,
    filtering.withPathSegment
  );
  const withoutPathSegment = optionOrEmpty(
    cmdLintFilterOptions.withoutPathSegment,
    filtering.withoutPathSegment
  );
  const withTag = optionOrEmpty(
    cmdLintFilterOptions.withTag,
    filtering.withTag
  );
  const withoutTag = optionOrEmpty(
    cmdLintFilterOptions.withoutTag,
    filtering.withoutTag
  );
  const withTagStarting = optionOrEmpty(
    cmdLintFilterOptions.withTagStarting,
    filtering.withTagStarting
  );
  const withoutTagStarting = optionOrEmpty(
    cmdLintFilterOptions.withoutTagStarting,
    filtering.withoutTagStarting
  );
  return [
    ...withPathStarting,
    ...withExtension,
    ...withPathSegment,
    ...withTag,
    ...withTagStarting,
    ...withoutPathStarting,
    ...withoutExtension,
    ...withoutPathSegment,
    ...withoutTag,
    ...withoutTagStarting,
  ];
};

const findByIdx = (values: [string, number][], idx: number): number => {
  const found = values[idx];
  return found ? found[1] || 0 : 0;
};

export const commanderStringsToFiltering = (
  cmdStrings: string[]
): FileFiltering => {
  const cmdStringsIdx: [string, number][] = cmdStrings.map((str, idx) => [
    str,
    idx,
  ]);
  const cmdStringsIdxKeys: [string, number][] = cmdStringsIdx.filter((valIdx) =>
    valIdx[0].startsWith('--')
  );

  const endIdx = cmdStrings.length;

  const useEndIndex = (idx: number): boolean =>
    idx === cmdStringsIdxKeys.length - 1;

  const cmdkeyRanges: [string, number, number][] = cmdStringsIdxKeys.map(
    ([a, b], idx, others) => [
      a,
      b + 1,
      useEndIndex(idx) ? endIdx : findByIdx(others, idx + 1),
    ]
  );

  const findValuesbyName = (name: string): string[] => {
    const found = cmdkeyRanges.find(
      (keyRange) => keyRange[0].slice(2) === name
    );
    return found ? cmdStrings.slice(found[1], found[2]) : [];
  };

  const filtering = {
    withPathStarting: findValuesbyName(
      cmdLintFilterOptions.withPathStarting.longFlag
    ),
    withoutPathStarting: findValuesbyName(
      cmdLintFilterOptions.withoutPathStarting.longFlag
    ),
    withExtension: findValuesbyName(
      cmdLintFilterOptions.withExtension.longFlag
    ),
    withoutExtension: findValuesbyName(
      cmdLintFilterOptions.withoutExtension.longFlag
    ),
    withPathSegment: findValuesbyName(
      cmdLintFilterOptions.withPathSegment.longFlag
    ),
    withoutPathSegment: findValuesbyName(
      cmdLintFilterOptions.withoutPathSegment.longFlag
    ),
    withTag: findValuesbyName(cmdLintFilterOptions.withTag.longFlag),
    withoutTag: findValuesbyName(cmdLintFilterOptions.withoutTag.longFlag),
    withTagStarting: findValuesbyName(
      cmdLintFilterOptions.withTagStarting.longFlag
    ),
    withoutTagStarting: findValuesbyName(
      cmdLintFilterOptions.withoutTagStarting.longFlag
    ),
  };
  return filtering;
};
