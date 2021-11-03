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

export type LintMode = 'check' | 'fix' | 'ci';
export type SupportedEcmaVersion = 2018| 2019 | 2020 | 2021;

export interface LintResolvedOpts {
  modulePath: string;
  mode: LintMode;
  pathPatterns: string[];
  ecmaVersion: SupportedEcmaVersion;
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
  | 'files'
  | 'load'
  | 'glob'
  | 'filter';

export type InstructionParams = { [paramName: string]: string[] };

export interface MicroInstruction {
  name: MicroInstructionName;
  params: InstructionParams;
}

export type LintInstructionStatus = 'ok' | 'ko' | 'warning';

export interface LintInstructionResult {
  text: string;
  json: string;
  status: LintInstructionStatus;
  lintResults: ESLint.LintResult[];
}

export interface RunnerContext {
  currentPath: string;
}

export interface LintActionRawOpts extends FileFiltering {
  aim: string;
  ecmaVersion: string;
}

export interface LintActionOpts {
  flags: string[];
  fileSearching: FileSearching;
  ecmaVersion: number;
  report: LintReport[];
}

export type LintAction = (
  ctx: RunnerContext,
  options: LintActionOpts
) => Promise<void>;

export interface CmdOption {
  shortFlag: string;
  longFlag: string;
  description: string;
  defaultValue: string | string[];
  choices: string[];
}
