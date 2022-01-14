import { ESLint } from 'eslint';

export interface PathInfo {
  path: string;
  tags: string[];
}

export interface FileFiltering {
  withPathStarting: string[];
  withoutPathStarting: string[];
  withExtension: string[];
  withoutExtension: string[];
  withPathSegment: string[];
  withoutPathSegment: string[];
  withTag: string[];
  withoutTag: string[];
  withTagStarting: string[];
  withoutTagStarting: string[];
}

type MinFileFiltering = Pick<FileFiltering, 'withPathStarting'>;

export interface FileSearching {
  pathInfos: PathInfo[];
  filtering: FileFiltering;
  useGlob: 'auto' | 'yes';
}

export type GlobAction = (script: string[]) => void;

export type SupportedFlag =
  | 'aim:fix'
  | 'aim:ci'
  | 'aim:check'
  | 'aim:cov'
  | 'globInputPaths:false';

// Update there src/flag-helper.ts
export type SupportedEcmaVersion = 2020 | 2021; // Update there too src/commanding-helper.ts

type InstructionParams = {
  flags: SupportedFlag[];
  targetFiles: string[];
  query: string[];
  extensions: string[];
  reportBase: string;
  reportDirectory: string;
  reportPrefix: string;
  displayName: string;
  ecmaVersion: SupportedEcmaVersion;
};

export type MicroInstruction =
  | {
      name: 'files';
      params: Pick<InstructionParams, 'targetFiles'>;
    }
  | {
      name: 'load';
      params: Pick<InstructionParams, 'targetFiles'>;
    }
  | {
      name: 'glob';
      params: Pick<InstructionParams, 'targetFiles'>;
    }
  | {
      name: 'filter';
      params: Pick<InstructionParams, 'query'>;
    }
  | {
      name: 'lint';
      params: Pick<
        InstructionParams,
        | 'targetFiles'
        | 'extensions'
        | 'reportBase'
        | 'reportDirectory'
        | 'reportPrefix'
        | 'flags'
        | 'ecmaVersion'
      >;
    }
  | {
      name: 'test';
      params: Pick<
        InstructionParams,
        | 'targetFiles'
        | 'reportBase'
        | 'reportDirectory'
        | 'reportPrefix'
        | 'flags'
        | 'displayName'
      >;
    }
  | {
      name: 'markdown';
      params: Pick<
        InstructionParams,
        'reportBase' | 'reportDirectory' | 'reportPrefix' | 'flags'
      >;
    };

export type InstructionStatus = 'ok' | 'ko' | 'warning';
type TermFormatterKind = 'intro' | 'info';
export type TermFormatterFormat = 'default' | 'human';

export interface TermFormatterParams {
  title: string;
  detail: string | object;
  kind: TermFormatterKind;
  format: TermFormatterFormat;
}

export interface ErrTermFormatterParams {
  title: string;
  detail: unknown;
}

export type TermFormatter = (params: TermFormatterParams) => void;

export type ErrTermFormatter = (params: ErrTermFormatterParams) => void;

export interface RunnerContext {
  currentPath: string;
  termFormatter: TermFormatter;
  errTermFormatter: ErrTermFormatter;
}

export interface CmdOption {
  shortFlag: string;
  longFlag: string;
  description: string;
  defaultValue: string | string[];
  choices: string[];
}

interface BaseAction {
  aim: string;
  reportBase: string;
}
// Lint
export interface LintActionRawOpts extends BaseAction, FileFiltering {
  ecmaVersion: string;
}

export interface LintActionOpts {
  flags: SupportedFlag[];
  fileSearching: FileSearching;
  ecmaVersion: SupportedEcmaVersion;
  reportBase: string;
  reportDirectory: string;
  reportPrefix: string;
}

export type LintAction = (
  ctx: RunnerContext,
  options: LintActionOpts
) => Promise<void>;

export interface LintResolvedOpts {
  modulePath: string;
  flags: SupportedFlag[];
  pathPatterns: string[];
  ecmaVersion: SupportedEcmaVersion;
}

export interface BasicInstructionResult {
  status: InstructionStatus;
}

export interface LintInstructionResult {
  text: string;
  json: string;
  junitXml: string;
  compact: string;
  status: InstructionStatus;
  lintResults: ESLint.LintResult[];
}

// Test
export interface TestActionRawOpts extends BaseAction, MinFileFiltering {
  displayName: string;
}

export interface TestActionOpts {
  flags: SupportedFlag[];
  fileSearching: FileSearching;
  reportBase: string;
  reportDirectory: string;
  reportPrefix: string;
  displayName: string;
}

export type TestAction = (
  ctx: RunnerContext,
  options: TestActionOpts
) => Promise<void>;

export interface TestResolvedOpts {
  modulePath: string;
  flags: SupportedFlag[];
  pathPatterns: string[];
  outputDirectory: string;
  outputName: string;
  displayName: string;
}

export interface TestInstructionResult {
  status: InstructionStatus;
}

// Markdown
export interface MarkdownActionRawOpts extends BaseAction, FileFiltering {}

export interface MarkdownActionOpts {
  flags: SupportedFlag[];
  fileSearching: FileSearching;
  reportBase: string;
  reportDirectory: string;
  reportPrefix: string;
}

export type MarkdownAction = (
  ctx: RunnerContext,
  options: MarkdownActionOpts
) => Promise<void>;

export interface MarkdownResolvedOpts {
  modulePath: string;
  flags: SupportedFlag[];
  pathPatterns: string[];
  outputDirectory: string;
  outputName: string;
}

export interface MarkdownInstructionResult {
  status: InstructionStatus;
}

// Release
export interface ReleaseActionOpts {
  flags: SupportedFlag[];
}

export type ReleaseAction = (
  ctx: RunnerContext,
  options: ReleaseActionOpts
) => Promise<void>;

export interface ReleaseResolvedOpts {
  flags: SupportedFlag[];
}
