import { CmdOption } from './model';

interface CmdLintOptions {
  aim: CmdOption;
  withPathStarting: CmdOption;
  withoutPathStarting: CmdOption;
  withExtension: CmdOption;
  withoutExtension: CmdOption;
  withPathSegment: CmdOption;
  withoutPathSegment: CmdOption;
  withTag: CmdOption;
  withoutTag: CmdOption;
  withTagStarting: CmdOption;
  withoutTagStarting: CmdOption;
  ecma: CmdOption;
}
const stringsOption = (
  shortFlag: string,
  longFlag: string,
  description: string
): CmdOption => ({
  shortFlag,
  longFlag,
  description,
  choices: [],
  defaultValue: [],
});

const choiceOption = (
  shortFlag: string,
  longFlag: string,
  description: string,
  choices: string[]
): CmdOption => ({
  shortFlag,
  longFlag,
  description,
  choices,
  defaultValue: choices[0],
});

export const cmdLintFilterOptions: CmdLintOptions = {
  aim: choiceOption('a', 'aim', 'Specify the aim for linting', [
    'check',
    'fix',
    'ci',
  ]),
  withPathStarting: stringsOption(
    's',
    'with-path-starting',
    'Specify a list of expected prefixes for the path (any will match)'
  ),
  withoutPathStarting: stringsOption(
    'S',
    'without-path-starting',
    'Exclude a list of unwanted prefixes for the path'
  ),
  withExtension: stringsOption(
    'e',
    'with-extension',
    'Specify a list of expected suffixes for the path (any will match)'
  ),
  withoutExtension: stringsOption(
    'E',
    'without-extension',
    'Exclude a list of unwanted suffixes for the path'
  ),
  withPathSegment: stringsOption(
    's',
    'with-path-segment',
    'Specify a list of expected texts that should be part of the path (any will match)'
  ),
  withoutPathSegment: stringsOption(
    'S',
    'without-path-segment',
    'Exclude a list of unwanted texts that should not be part of the path'
  ),
  withTag: stringsOption(
    't',
    'with-tag',
    'Specify a list of expected tags (any will match)'
  ),
  withoutTag: stringsOption(
    'T',
    'without-tag',
    'Exclude a list of unwanted tags'
  ),
  withTagStarting: stringsOption(
    'p',
    'with-tag-starting',
    'Specify a list of expected prefixes for the tag (any will match)'
  ),
  withoutTagStarting: stringsOption(
    'P',
    'without-tag-starting',
    'Exclude a list of unwanted prefixes for the tag'
  ),
  ecma: choiceOption('ecma', 'ecma-version', 'Specify the ECMAScript version', [
    '2021',
    '2020',
    '2019',
    '2018',
  ]),
};
