import { ESLint } from 'eslint';

type PresetRollupOptionsStrategy = 'development' | 'production';
type ModuleFormat = 'cjs' | 'umd' | 'esm' | 'system';

export interface PresetRollupOptions {
  buildFolder: string;
  name: string;
  input: string;
  strategy: PresetRollupOptionsStrategy;
  format: ModuleFormat;
}

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

export type LintReport =
  | { kind: 'junit'; filename: string }
  | { kind: 'json'; filename: string };

export type FileSearchMode = 'find' | 'list' | 'load';

export type MicroInstructionName =
  | 'lint'
  | 'test'
  | 'files'
  | 'load'
  | 'glob'
  | 'filter'
  | 'build';

export type InstructionParams = { [paramName: string]: string[] };

export interface MicroInstruction {
  name: MicroInstructionName;
  params: InstructionParams;
}

export type InstructionStatus = 'ok' | 'ko' | 'warning';

export type TermFormatterKind = 'intro' | 'info';
export type TermFormatterFormat = 'default' | 'human';

export interface TermFormatterParams {
  title: string;
  detail: string | object;
  kind: TermFormatterKind;
  format: TermFormatterFormat;
}

export type TermFormatter = (params: TermFormatterParams) => void;

export interface RunnerContext {
  currentPath: string;
  termFormatter: TermFormatter;
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
  flags: string[];
  fileSearching: FileSearching;
  ecmaVersion: number;
  reportBase: string;
}

export type LintAction = (
  ctx: RunnerContext,
  options: LintActionOpts
) => Promise<void>;

export type LintMode = 'check' | 'fix' | 'ci';
export type SupportedEcmaVersion = 2018 | 2019 | 2020 | 2021;

export interface LintResolvedOpts {
  modulePath: string;
  mode: LintMode;
  pathPatterns: string[];
  ecmaVersion: SupportedEcmaVersion;
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
  flags: string[];
  fileSearching: FileSearching;
  reportBase: string;
  displayName: string;
}

export type TestAction = (
  ctx: RunnerContext,
  options: TestActionOpts
) => Promise<void>;

export type TestMode = 'check' | 'cov' | 'fix' | 'ci' | 'watch';

export interface TestResolvedOpts {
  modulePath: string;
  mode: TestMode;
  pathPatterns: string[];
  outputDirectory: string;
  outputName: string;
  displayName: string;
}

export interface TestInstructionResult {
  status: InstructionStatus;
}

// Build
export interface BuildActionRawOpts extends FileFiltering {
  aim: string;
  reportBase: string;
}

export interface BuildActionOpts {
  flags: string[];
  fileSearching: FileSearching;
  reportBase: string;
}

export type BuildAction = (
  ctx: RunnerContext,
  options: BuildActionOpts
) => Promise<void>;

export type BuildMode = 'check' | 'prod';

export interface BuildResolvedOpts {
  modulePath: string;
  mode: BuildMode;
  pathPatterns: string[];
  outputDirectory: string;
  outputName: string;
}

export interface BuildInstructionResult {
  status: InstructionStatus;
}
