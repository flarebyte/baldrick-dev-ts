import { FileFiltering, PathInfo, CmdOption } from './model';
import { cmdLintFilterOptions } from './commanding-data';

export const emptyFileFiltering: FileFiltering = {
  withPathStarting: [],
  withoutPathStarting: [],
  withExtension: [],
  withoutExtension: [],
  withPathSegment: [],
  withoutPathSegment: [],
  withTag: [],
  withoutTag: [],
};

export const byFileQuery =
  (query: FileFiltering) =>
  (pathInfo: PathInfo): boolean => {
    const noWithFilter =
      query.withPathStarting.length +
        query.withExtension.length +
        query.withPathSegment.length +
        query.withTag.length ===
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
        query.withTag.some((tag) => pathInfo.tags.includes(tag))) &&
      !(
        query.withoutPathStarting.some((start) =>
          pathInfo.path.startsWith(start)
        ) ||
        query.withoutExtension.some((ext) => pathInfo.path.endsWith(ext)) ||
        query.withoutPathSegment.some((segment) =>
          pathInfo.path.includes(segment)
        ) ||
        query.withoutTag.some((tag) => pathInfo.tags.includes(tag))
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
    cmdLintFilterOptions.withPathStarting,
    filtering.withPathStarting
  );
  const withoutPathSegment = optionOrEmpty(
    cmdLintFilterOptions.withPathSegment,
    filtering.withPathSegment
  );
  const withTag = optionOrEmpty(
    cmdLintFilterOptions.withTag,
    filtering.withTag
  );
  const withoutTag = optionOrEmpty(
    cmdLintFilterOptions.withoutTag,
    filtering.withoutTag
  );
  return [
    ...withPathStarting,
    ...withExtension,
    ...withPathSegment,
    ...withTag,
    ...withoutPathStarting,
    ...withoutExtension,
    ...withoutPathSegment,
    ...withoutTag,
  ];
};
