import { ESLint } from 'eslint';

export type ObjectWithKeys = { [key: string]: any };

export interface PackageJson {
  name: string;
  source?: string;
  jest?: ObjectWithKeys;
  eslint?: ObjectWithKeys;
  prettier?: ObjectWithKeys;
  dependencies?: { [packageName: string]: string };
  devDependencies?: { [packageName: string]: string };
  engines?: {
    node?: string;
  };
}
interface SharedOpts {
  target: 'node' | 'browser';
  // Path to tsconfig file
  tsconfig?: string;
  // Is error extraction running?
  extractErrors?: boolean;
}
export type ModuleFormat = 'cjs' | 'umd' | 'esm' | 'system';

export interface BuildOpts extends SharedOpts {
  name?: string;
  entry?: string | string[];
  format: 'cjs,esm';
  target: 'browser';
}

export interface WatchOpts extends BuildOpts {
  verbose?: boolean;
  noClean?: boolean;
  onFirstSuccess?: string;
  onSuccess?: string;
  onFailure?: string;
}

export interface NormalizedOpts
  extends Omit<WatchOpts, 'name' | 'input' | 'format'> {
  name: string;
  input: string[];
  format: [ModuleFormat, ...ModuleFormat[]];
}

export interface JestOpts {
  config?: string;
}

export interface LintOpts {
  fix: boolean;
  writeFile: boolean;
  reportFile: string;
  maxWarnings: number;
}

export interface TsdxOptions extends SharedOpts {
  // Name of package
  name: string;
  // path to file
  input: string;
  // Environment
  env: 'development' | 'production';
  // Module format
  format: ModuleFormat;
  // Is minifying?
  minify?: boolean;
  // Is this the very first rollup config (and thus should one-off metadata be extracted)?
  writeMeta?: boolean;
  // Only transpile, do not type check (makes compilation faster)
  transpileOnly?: boolean;
}

export type ProfileName = 'ts-lib' | 'ts-cli';

export interface Coverage {
  ignore: string[];
  branches: number;
  functions: number;
  lines: number;
  statements: number;
}

export interface Linting {
  ignore: string[];
}

export interface ToolOptions {
  profileName: ProfileName;
  sizeLimitKB: number;
  coverage: Coverage;
  linting: Linting;
}

export interface LocalSetup {
  modulePath: string;
  toolOptions: ToolOptions;
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

export type FilterArgs = {};

export interface StatusRecord {
  title: string;
  message: string;
  params: string[];
  status: 'before' | 'success' | 'failure';
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
  options: TestActionOpts
) => Promise<void>;

export type BuildMode = 'check';

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