import { CmdOption } from './model';

interface CmdLintFilterOptions {
  withPathStarting: CmdOption;
  withoutPathStarting: CmdOption;
  withExtension: CmdOption;
  withoutExtension: CmdOption;
  withPathSegment: CmdOption;
  withoutPathSegment: CmdOption;
  withTag: CmdOption;
  withoutTag: CmdOption;
}
const option = (
  shortFlag: string,
  longFlag: string,
  description: string
): CmdOption => ({
  shortFlag,
  longFlag,
  description,
});


export const cmdLintFilterOptions: CmdLintFilterOptions = {
  withPathStarting: option('s', 'with-path-starting', 'Specify a list of expected prefixes for the path (any will match)'),
  withoutPathStarting: option('S', 'without-path-starting', 'Exclude a list of unwanted prefixes for the path'),
  withExtension: option('e', 'with-extension', 'Specify a list of expected suffixes for the path (any will match)'),
  withoutExtension: option('E', 'without-extension', 'Exclude a list of unwanted suffixes for the path'),
  withPathSegment: option('s', 'with-path-segment', 'Specify a list of expected texts that should be part of the path (any will match)'),
  withoutPathSegment: option('S', 'without-path-segment', 'Exclude a list of unwanted texts that should not be part of the path'),
  withTag: option('t', 'with-tag', 'Specify a list of expected tags (any will match)'),
  withoutTag: option('T', 'without-tag', 'Exclude a list of unwanted tags'),
};
