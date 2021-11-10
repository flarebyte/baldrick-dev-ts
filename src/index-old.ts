import sade from "sade";
import fs from "fs-extra";

import * as jest from "jest";
import { computeJestConfig } from "./jest-config-old";
import { readPackageJsonSync } from "./package-json";
import { version } from "./version";
import { computeEsLintConfig } from "./eslint-config";
import { BuildOpts, JestOpts, LintOpts } from "./model";
import { CLIEngine } from "eslint";
import { cleanDistFolder, computeRollupConfig, writeCjsEntryFile } from "./rollup-config";
import logError from "./log-error";
import {
  rollup,
  RollupOptions,
  OutputOptions,
} from 'rollup';
import asyncro from 'asyncro';

const prog = sade("devts");
prog.version(version);

const appPackageJson = readPackageJsonSync();

const testCmd = async (opts: JestOpts) => {
  // Do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = "test";
  process.env.NODE_ENV = "test";
  // Makes the script crash on unhandled rejections instead of silently
  // ignoring them. In the future, promise rejections that are not handled will
  // terminate the Node.js process with a non-zero exit code.
  process.on("unhandledRejection", (err) => {
    throw err;
  });

  const argv = process.argv.slice(2);
  const jestConfig = computeJestConfig(appPackageJson, opts);

  // if custom path, delete the arg as it's already been merged
  if (opts.config) {
    let configIndex = argv.indexOf("--config");
    if (configIndex !== -1) {
      // case of "--config path", delete both args
      argv.splice(configIndex, 2);
    } else {
      // case of "--config=path", only one arg to delete
      const configRegex = /--config=.+/;
      configIndex = argv.findIndex((arg) => arg.match(configRegex));
      if (configIndex !== -1) {
        argv.splice(configIndex, 1);
      }
    }
  }

  argv.push(
    "--config",
    JSON.stringify({
      ...jestConfig,
    })
  );

  const [, ...argsToPassToJestCli] = argv;
  jest.run(argsToPassToJestCli);
};

const lintCmd = async (opts: LintOpts) => {
  if (opts["_"].length === 0 && !opts["write-file"]) {
    const defaultInputs = ["src", "test"].filter(fs.existsSync);
    opts["_"] = defaultInputs;
  }

  const cliConfig = computeEsLintConfig(appPackageJson, opts);

  const cli = new CLIEngine(cliConfig);
  const report = cli.executeOnFiles(opts["_"]);
  if (opts.fix) {
    CLIEngine.outputFixes(report);
  }
  console.log(cli.getFormatter()(report.results));
  if (opts["report-file"]) {
    await fs.outputFile(
      opts["report-file"],
      cli.getFormatter("json")(report.results)
    );
  }
  if (report.errorCount) {
    process.exit(1);
  }
  if (report.warningCount > opts["max-warnings"]) {
    process.exit(1);
  }
};

const buildCmd = async (dirtyOpts: BuildOpts) => {
  const buildConfigs = await computeRollupConfig(appPackageJson, dirtyOpts);
  await cleanDistFolder();
  if (dirtyOpts.format.includes('cjs')) {
    writeCjsEntryFile(dirtyOpts.name || 'no-name').catch(logError);
  }
  try {
    const promise = asyncro
      .map(
        buildConfigs,
        async (inputOptions: RollupOptions & { output: OutputOptions }) => {
          let bundle = await rollup(inputOptions);
          await bundle.write(inputOptions.output);
        }
      )
      .catch((e: any) => {
        throw e;
      })
    await promise;
  } catch (error) {
    logError(error);
    process.exit(1);
  }
}

prog
  .command("test")
  .describe("Run jest test runner. Passes through all flags directly to Jest")
  .action(testCmd);

prog
  .command("lint")
  .describe("Run eslint with Prettier")
  .example("lint src test")
  .option("--fix", "Fixes fixable errors and warnings")
  .example("lint src test --fix")
  .option("--ignore-pattern", "Ignore a pattern")
  .example("lint src test --ignore-pattern test/foobar.ts")
  .option(
    "--max-warnings",
    "Exits with non-zero error code if number of warnings exceed this number",
    Infinity
  )
  .example("lint src test --max-warnings 10")
  .option("--write-file", "Write the config file locally")
  .example("lint --write-file")
  .option("--report-file", "Write JSON report to file locally")
  .example("lint --report-file eslint-report.json")
  .action(lintCmd);

  prog
  .command('build')
  .describe('Build your project once and exit')
  .option('--entry, -i', 'Entry module')
  .example('build --entry src/foo.tsx')
  .option('--target', 'Specify your target environment', 'browser')
  .example('build --target node')
  .option('--name', 'Specify name exposed in UMD builds')
  .example('build --name Foo')
  .option('--format', 'Specify module format(s)', 'cjs,esm')
  .example('build --format cjs,esm')
  .option('--tsconfig', 'Specify custom tsconfig path')
  .example('build --tsconfig ./tsconfig.foo.json')
  .option('--transpileOnly', 'Skip type checking')
  .example('build --transpileOnly')
  .option(
    '--extractErrors',
    'Extract errors to ./errors/codes.json and provide a url for decoding.'
  )
  .example(
    'build --extractErrors=https://reactjs.org/docs/error-decoder.html?invariant='
  )
  .action(buildCmd);


prog.parse(process.argv);
