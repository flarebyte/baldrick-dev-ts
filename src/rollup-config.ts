import {
  BuildOpts,
  ModuleFormat,
  NormalizedOpts,
  PackageJson,
  TsdxOptions,
  WatchOpts,
} from "./model";
import { resolveApp } from "./resolve-app";
import glob from "tiny-glob/sync";
import path from "path";
import fs from "fs-extra";
import { paths } from "./path-helper";
import { RollupOptions } from "rollup";
import ts from "typescript";
import camelCase from "camelcase";
import resolve, {
  DEFAULTS as RESOLVE_DEFAULTS,
} from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import sourceMaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";

export type Many<T> = T | T[];

let push = Array.prototype.push;

export function concatAllArray<T>(array: Many<T>[]) {
  const ret: T[] = [];
  for (let ii = 0; ii < array.length; ii++) {
    const value = array[ii];
    if (Array.isArray(value)) {
      push.apply(ret, value);
    } else if (value != null) {
      throw new TypeError(
        "concatAllArray: All items in the array must be an array or null, " +
          'got "' +
          value +
          '" at index "' +
          ii +
          '" instead'
      );
    }
  }
  return ret;
}

export const isDir = (name: string) =>
  fs
    .stat(name)
    .then((stats) => stats.isDirectory())
    .catch(() => false);

async function getInputs(
  entries?: string | string[],
  source?: string
): Promise<string[]> {
  return concatAllArray(
    ([] as any[])
      .concat(
        entries && entries.length
          ? entries
          : (source && resolveApp(source)) || (await isDir(resolveApp("src")))
      )
      .map((file) => glob(file))
  );
}

export async function cleanDistFolder() {
  await fs.remove(paths.appDist);
}

// Remove the package name scope if it exists
export const removeScope = (name: string) => name.replace(/^@.*\//, "");

const safeVariableName = (name: string) =>
  camelCase(
    removeScope(name)
      .toLowerCase()
      .replace(/((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, "")
  );

async function normalizeOpts(
  appPackageJson: PackageJson,
  opts: WatchOpts
): Promise<NormalizedOpts> {
  return {
    ...opts,
    name: opts.name || appPackageJson.name,
    input: await getInputs(opts.entry, appPackageJson.source),
    format: opts.format.split(",").map((format: string) => {
      if (format === "es") {
        return "esm";
      }
      return format;
    }) as [ModuleFormat, ...ModuleFormat[]],
  };
}
async function createRollupConfig(
  opts: TsdxOptions,
  outputNum: number
): Promise<RollupOptions> {
  const shouldMinify =
    opts.minify !== undefined ? opts.minify : opts.env === "production";

  const outputName = [
    `${paths.appDist}/${safePackageName(opts.name)}`,
    opts.format,
    opts.env,
    shouldMinify ? "min" : "",
    "js",
  ]
    .filter(Boolean)
    .join(".");

  const external = (id: string) => !id.startsWith(".") && !path.isAbsolute(id);

  const tsconfigPath = opts.tsconfig || paths.tsconfigJson;
  // borrowed from https://github.com/facebook/create-react-app/pull/7248
  const tsconfigJSON = ts.readConfigFile(tsconfigPath, ts.sys.readFile).config;
  // borrowed from https://github.com/ezolenko/rollup-plugin-typescript2/blob/42173460541b0c444326bf14f2c8c27269c4cb11/src/parse-tsconfig.ts#L48
  const tsCompilerOptions = ts.parseJsonConfigFileContent(
    tsconfigJSON,
    ts.sys,
    "./"
  ).options;

  return {
    // Tell Rollup the entry point to the package
    input: opts.input,
    // Tell Rollup which packages to ignore
    external: (id: string) => {
      // bundle in polyfills as TSDX can't (yet) ensure they're installed as deps
      if (id.startsWith("regenerator-runtime")) {
        return false;
      }

      return external(id);
    },
    // Rollup has treeshaking by default, but we can optimize it further...
    treeshake: {
      // We assume reading a property of an object never has side-effects.
      // This means tsdx WILL remove getters and setters defined directly on objects.
      // Any getters or setters defined on classes will not be effected.
      //
      // @example
      //
      // const foo = {
      //  get bar() {
      //    console.log('effect');
      //    return 'bar';
      //  }
      // }
      //
      // const result = foo.bar;
      // const illegalAccess = foo.quux.tooDeep;
      //
      // Punchline....Don't use getters and setters
      propertyReadSideEffects: false,
    },
    // Establish Rollup output
    output: {
      // Set filenames of the consumer's package
      file: outputName,
      // Pass through the file format
      format: opts.format,
      // Do not let Rollup call Object.freeze() on namespace import objects
      // (i.e. import * as namespaceImportObject from...) that are accessed dynamically.
      freeze: false,
      // Respect tsconfig esModuleInterop when setting __esModule.
      esModule: Boolean(tsCompilerOptions?.esModuleInterop),
      name: opts.name || safeVariableName(opts.name),
      sourcemap: true,
      globals: { react: "React", "react-native": "ReactNative" },
      exports: "named",
    },
    plugins: [
      resolve({
        mainFields: [
          "module",
          "main",
          opts.target !== "node" ? "browser" : undefined,
        ].filter(Boolean) as string[],
        extensions: [...RESOLVE_DEFAULTS.extensions, ".jsx"],
      }),
      // all bundled external modules need to be converted from CJS to ESM
      commonjs({
        // use a regex to make sure to include eventual hoisted packages
        include:
          opts.format === "umd"
            ? /\/node_modules\//
            : /\/regenerator-runtime\//,
      }),
      json(),
      typescript({
        typescript: ts,
        tsconfig: opts.tsconfig,
        tsconfigDefaults: {
          exclude: [
            // all TS test files, regardless whether co-located or in test/ etc
            "**/*.spec.ts",
            "**/*.test.ts",
            "**/*.spec.tsx",
            "**/*.test.tsx",
            // TS defaults below
            "node_modules",
            "bower_components",
            "jspm_packages",
            paths.appDist,
          ],
          compilerOptions: {
            sourceMap: true,
            declaration: true,
            jsx: "react",
          },
        },
        tsconfigOverride: {
          compilerOptions: {
            // TS -> esnext, then leave the rest to babel-preset-env
            target: "esnext",
            // don't output declarations more than once
            ...(outputNum > 0
              ? { declaration: false, declarationMap: false }
              : {}),
          },
        },
        check: !opts.transpileOnly && outputNum === 0,
        useTsconfigDeclarationDir: Boolean(tsCompilerOptions?.declarationDir),
      }),
      opts.env !== undefined &&
        replace({
          "process.env.NODE_ENV": JSON.stringify(opts.env),
        }),
      sourceMaps(),
      shouldMinify &&
        terser({
          output: { comments: false },
          compress: {
            keep_infinity: true,
            pure_getters: true,
            passes: 10,
          },
          ecma: 5,
          toplevel: opts.format === "cjs",
        }),
    ],
  };
}

function createAllFormats(
  opts: NormalizedOpts,
  input: string
): [TsdxOptions, ...TsdxOptions[]] {
  return [
    opts.format.includes("cjs") && {
      ...opts,
      format: "cjs",
      env: "development",
      input,
    },
    opts.format.includes("cjs") && {
      ...opts,
      format: "cjs",
      env: "production",
      input,
    },
    opts.format.includes("esm") && { ...opts, format: "esm", input },
    opts.format.includes("umd") && {
      ...opts,
      format: "umd",
      env: "development",
      input,
    },
    opts.format.includes("umd") && {
      ...opts,
      format: "umd",
      env: "production",
      input,
    },
    opts.format.includes("system") && {
      ...opts,
      format: "system",
      env: "development",
      input,
    },
    opts.format.includes("system") && {
      ...opts,
      format: "system",
      env: "production",
      input,
    },
  ].filter(Boolean) as [TsdxOptions, ...TsdxOptions[]];
}

// check for custom tsdx.config.js
let tsdxConfig = {
  rollup(config: RollupOptions, _options: TsdxOptions): RollupOptions {
    return config;
  },
};

if (fs.existsSync(paths.appConfig)) {
  tsdxConfig = require(paths.appConfig);
}

export async function createBuildConfigs(
  opts: NormalizedOpts
) {
  const allInputs = concatAllArray(
    opts.input.map((input: string) =>
      createAllFormats(opts, input).map(
        (options: TsdxOptions, index: number) => ({
          ...options,
          // We want to know if this is the first run for each entryfile
          // for certain plugins (e.g. css)
          writeMeta: index === 0,
        })
      )
    )
  );

  return await Promise.all(
    allInputs.map(async (options: TsdxOptions, index: number) => {
      // pass the full rollup config to tsdx.config.js override
      const config = await createRollupConfig(options, index);
      return tsdxConfig.rollup(config, options);
    })
  );
}
export const computeRollupConfig = async (
  appPackageJson: PackageJson,
  dirtyOpts: BuildOpts
) => {
  const opts = await normalizeOpts(appPackageJson, dirtyOpts);
  const buildConfigs = await createBuildConfigs(opts);
  return buildConfigs;
};

const safePackageName = (name: string) =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, "");

export function writeCjsEntryFile(name: string) {
  const baseLine = `module.exports = require('./${safePackageName(name)}`;
  const contents = `
'use strict'
if (process.env.NODE_ENV === 'production') {
  ${baseLine}.cjs.production.min.js')
} else {
  ${baseLine}.cjs.development.js')
}
`;
  return fs.outputFile(path.join(paths.appDist, "index.js"), contents);
}
