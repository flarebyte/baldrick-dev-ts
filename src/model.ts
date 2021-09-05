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

export interface LintResolvedOpts {
  modulePath: string;
  mode: LintMode;
  folders: string[];
}

export interface PathInfo {
  path: string;
  flags: string[];
}

export const supportedFileInfoFilterKind = [
  'with-path-starting:',
  'with-no-path-starting:',
  'with-extension:',
  'with-no-extension:',
  'with-path-segment:',
  'with-no-path-segment:',
  'with-flag:',
  'with-no-flag:',
];

export type FileInfoFilter =
  | { kind: 'unknown' }
  | { kind: 'with-path-starting:'; values: string[] }
  | { kind: 'with-no-path-starting:'; values: string[] }
  | { kind: 'with-extension:'; values: string[] }
  | { kind: 'with-no-extension:'; values: string[] }
  | { kind: 'with-path-segment:'; values: string[] }
  | { kind: 'with-no-path-segment:'; values: string[] }
  | { kind: 'with-flag:'; values: string[] }
  | { kind: 'with-no-flag:'; values: string[] };

export type FilterArgs = {};

export interface StatusRecord {
  title: string;
  message: string;
  params: string[];
  status: 'before' | 'success' | 'failure';
}

export type GlobAction = (script: string[]) => void;
