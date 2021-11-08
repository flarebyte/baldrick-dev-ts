import { CmdOption } from './model';

interface CmdOptions {
  aim: CmdOption;
  reportBase: CmdOption;
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
}

interface CmdLintOptions extends CmdOptions {
  ecma: CmdOption;
}

interface CmdTestOptions extends CmdOptions {}

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

const stringOption = (
  shortFlag: string,
  longFlag: string,
  description: string,
  defaultValue: string
): CmdOption => ({
  shortFlag,
  longFlag,
  description,
  defaultValue,
  choices: [],
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

const withPathStarting = stringsOption(
  's',
  'with-path-starting',
  'Specify a list of expected prefixes for the path (any will match)'
);
const withoutPathStarting = stringsOption(
  'S',
  'without-path-starting',
  'Exclude a list of unwanted prefixes for the path'
);
const withExtension = stringsOption(
  'e',
  'with-extension',
  'Specify a list of expected suffixes for the path (any will match)'
);
const withoutExtension = stringsOption(
  'E',
  'without-extension',
  'Exclude a list of unwanted suffixes for the path'
);
const withPathSegment = stringsOption(
  's',
  'with-path-segment',
  'Specify a list of expected texts that should be part of the path (any will match)'
);
const withoutPathSegment = stringsOption(
  'S',
  'without-path-segment',
  'Exclude a list of unwanted texts that should not be part of the path'
);
const withTag = stringsOption(
  't',
  'with-tag',
  'Specify a list of expected tags (any will match)'
);
const withoutTag = stringsOption(
  'T',
  'without-tag',
  'Exclude a list of unwanted tags'
);
const withTagStarting = stringsOption(
  'p',
  'with-tag-starting',
  'Specify a list of expected prefixes for the tag (any will match)'
);
const withoutTagStarting = stringsOption(
  'P',
  'without-tag-starting',
  'Exclude a list of unwanted prefixes for the tag'
);

export const cmdLintFilterOptions: CmdLintOptions = {
  aim: choiceOption('a', 'aim', 'Specify the aim for linting', [
    'check',
    'fix',
    'ci',
  ]),
  reportBase: stringOption(
    'rb',
    'report-base',
    'Specify the base name for reporting',
    'report/lint-report'
  ),
  withPathStarting,
  withoutPathStarting,
  withExtension,
  withoutExtension,
  withPathSegment,
  withoutPathSegment,
  withTag,
  withoutTag,
  withTagStarting,
  withoutTagStarting,
  ecma: choiceOption('ecma', 'ecma-version', 'Specify the ECMAScript version', [
    '2021',
    '2020',
    '2019',
    '2018',
  ]),
};

export const cmdTestFilterOptions: CmdTestOptions = {
  aim: choiceOption('a', 'aim', 'Specify the aim for testing', [
    'check',
    'watch',
    'ci',
  ]),
  reportBase: stringOption(
    'rb',
    'report-base',
    'Specify the base name for reporting',
    'report/test-report'
  ),
  withPathStarting,
  withoutPathStarting,
  withExtension,
  withoutExtension,
  withPathSegment,
  withoutPathSegment,
  withTag,
  withoutTag,
  withTagStarting,
  withoutTagStarting,
};
