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

export interface FileSearching {
  pathInfos: PathInfo[];
  filtering: FileFiltering;
}

export type GlobAction = (script: string[]) => void;

export type SupportedFlag =
  | 'unknown'
  | 'aim:fix'
  | 'aim:ci'
  | 'aim:check'
  | 'aim:cov'
  | 'globInputPaths:false';

type InstructionParams = {
  flags: SupportedFlag[];
  targetFiles: string[];
  query: string[];
  extensions: string[];
  reportBase: string;
  displayName: string;
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
        'targetFiles' | 'extensions' | 'reportBase' | 'flags'
      >;
    }
  | {
      name: 'test';
      params: Pick<
        InstructionParams,
        'targetFiles' | 'extensions' | 'reportBase' | 'flags' | 'displayName'
      >;
    }
  | {
      name: 'build';
      params: Pick<
        InstructionParams,
        'targetFiles' | 'extensions' | 'reportBase' | 'flags'
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

// Lint
export interface LintActionRawOpts extends FileFiltering {
  aim: string;
  reportBase: string;
  ecmaVersion: string;
}

export interface LintActionOpts {
  flags: SupportedFlag[];
  fileSearching: FileSearching;
  ecmaVersion: number;
  reportBase: string;
}

export type LintAction = (
  ctx: RunnerContext,
  options: LintActionOpts
) => Promise<void>;

export type SupportedEcmaVersion = 2020 | 2021;

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
export interface TestActionRawOpts extends FileFiltering {
  aim: string;
  reportBase: string;
  displayName: string;
}

export interface TestActionOpts {
  flags: SupportedFlag[];
  fileSearching: FileSearching;
  reportBase: string;
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

// Build

export interface TscOptionsConfig {
  buildFolder: string;
  name: string;
  input: string;
}

export interface BuildActionRawOpts extends FileFiltering {
  aim: string;
  reportBase: string;
}

export interface BuildActionOpts {
  flags: SupportedFlag[];
  fileSearching: FileSearching;
  reportBase: string;
}

export type BuildAction = (
  ctx: RunnerContext,
  options: BuildActionOpts
) => Promise<void>;

export interface BuildResolvedOpts {
  modulePath: string;
  flags: SupportedFlag[];
  pathPatterns: string[];
  outputDirectory: string;
  outputName: string;
}

export interface BuildInstructionResult {
  status: InstructionStatus;
}
