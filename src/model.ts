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
  target: "node" | "browser";
  // Path to tsconfig file
  tsconfig?: string;
  // Is error extraction running?
  extractErrors?: boolean;
}
export type ModuleFormat = "cjs" | "umd" | "esm" | "system";

export interface BuildOpts extends SharedOpts {
  name?: string;
  entry?: string | string[];
  format: "cjs,esm";
  target: "browser";
}

export interface WatchOpts extends BuildOpts {
  verbose?: boolean;
  noClean?: boolean;
  onFirstSuccess?: string;
  onSuccess?: string;
  onFailure?: string;
}

export interface NormalizedOpts
  extends Omit<WatchOpts, "name" | "input" | "format"> {
  name: string;
  input: string[];
  format: [ModuleFormat, ...ModuleFormat[]];
}

export interface JestOpts {
  config?: string;
}

export interface LintOpts {
  fix: boolean;
  "ignore-pattern": string;
  "write-file": boolean;
  "report-file": string;
  "max-warnings": number;
  _: string[];
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

export interface LocalSetup {
  rootFileNames: string[];
  packageJson: PackageJson;
  tsConfig?: ObjectWithKeys;
  eslintConfig?: ObjectWithKeys;
  prettierConfig?: ObjectWithKeys;
  jestConfig?: ObjectWithKeys;
}
