import { Command } from 'commander';
import { version } from './version.js';
import {
  BuildAction,
  BuildActionOpts,
  BuildActionRawOpts,
  GlobAction,
  LintAction,
  LintActionOpts,
  LintActionRawOpts,
  RunnerContext,
  TestAction,
  TestActionOpts,
  TestActionRawOpts,
} from './model';
import { toCommanderArgument, toCommanderOption, toSupportedEcma } from './commanding-helper.js';
import {
  cmdBuildFilterOptions,
  cmdLintFilterOptions,
  cmdTestFilterOptions,
} from './commanding-data.js';
import { basicFormatter, errorFormatter } from '../src/term-formatter.js';
import { toSupportedFlags } from './flag-helper.js';

export class Commanding {
  _program: Command = new Command();
  constructor() {
    this._program.version(version);
  }
  declareGlobAction(globAction: GlobAction) {
    this._program
      .command('do')
      .argument('[script...]')
      .description('Run a glob script')
      .action((script: string[]) => {
        globAction(script);
      });
  }
  declareLintAction(lintAction: LintAction) {
    this._program
      .command('lint')
      .description('Lint the code')
      .addArgument(toCommanderArgument(cmdLintFilterOptions.aim))
      .addOption(toCommanderOption(cmdLintFilterOptions.reportBase))
      .addOption(toCommanderOption(cmdLintFilterOptions.withPathStarting))
      .addOption(toCommanderOption(cmdLintFilterOptions.withoutPathStarting))
      .addOption(toCommanderOption(cmdLintFilterOptions.withExtension))
      .addOption(toCommanderOption(cmdLintFilterOptions.withoutExtension))
      .addOption(toCommanderOption(cmdLintFilterOptions.withPathSegment))
      .addOption(toCommanderOption(cmdLintFilterOptions.withoutPathSegment))
      .addOption(toCommanderOption(cmdLintFilterOptions.withTag))
      .addOption(toCommanderOption(cmdLintFilterOptions.withoutTag))
      .addOption(toCommanderOption(cmdLintFilterOptions.withTagStarting))
      .addOption(toCommanderOption(cmdLintFilterOptions.withoutTagStarting))
      .addOption(toCommanderOption(cmdLintFilterOptions.ecma))
      .action(async (aim: string, options: LintActionRawOpts) => {
        const {
          reportBase,
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
        } = options;
        const lintOpts: LintActionOpts = {
          flags: toSupportedFlags([`aim:${aim}`]),
          fileSearching: {
            pathInfos: [],
            filtering: {
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
            },
          },
          ecmaVersion: toSupportedEcma(options.ecmaVersion),
          reportBase,
        };
        const ctx: RunnerContext = {
          currentPath: process.cwd(),
          termFormatter: basicFormatter,
          errTermFormatter: errorFormatter,
        };
        await lintAction(ctx, lintOpts);
      });
  }

  declareTestAction(testAction: TestAction) {
    this._program
      .command('test')
      .description('Test the code')
      .addArgument(toCommanderArgument(cmdTestFilterOptions.aim))
      .addOption(toCommanderOption(cmdTestFilterOptions.reportBase))
      .addOption(toCommanderOption(cmdTestFilterOptions.displayName))
      .addOption(toCommanderOption(cmdTestFilterOptions.withPathStarting))
      .addOption(toCommanderOption(cmdTestFilterOptions.withoutPathStarting))
      .addOption(toCommanderOption(cmdTestFilterOptions.withExtension))
      .addOption(toCommanderOption(cmdTestFilterOptions.withoutExtension))
      .addOption(toCommanderOption(cmdTestFilterOptions.withPathSegment))
      .addOption(toCommanderOption(cmdTestFilterOptions.withoutPathSegment))
      .addOption(toCommanderOption(cmdTestFilterOptions.withTag))
      .addOption(toCommanderOption(cmdTestFilterOptions.withoutTag))
      .addOption(toCommanderOption(cmdTestFilterOptions.withTagStarting))
      .addOption(toCommanderOption(cmdTestFilterOptions.withoutTagStarting))
      .action(async (aim: string, options: TestActionRawOpts) => {
        const {
          reportBase,
          displayName,
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
        } = options;
        const testOpts: TestActionOpts = {
          flags: toSupportedFlags([`aim:${aim}`]),
          fileSearching: {
            pathInfos: [],
            filtering: {
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
            },
          },
          reportBase,
          displayName,
        };
        const ctx: RunnerContext = {
          currentPath: process.cwd(),
          termFormatter: basicFormatter,
          errTermFormatter: errorFormatter,
        };
        await testAction(ctx, testOpts);
      });
  }

  declareBuildAction(buildAction: BuildAction) {
    this._program
      .command('build')
      .description('Build the code')
      .addArgument(toCommanderArgument(cmdBuildFilterOptions.aim))
      .addOption(toCommanderOption(cmdBuildFilterOptions.reportBase))
      .addOption(toCommanderOption(cmdBuildFilterOptions.withPathStarting))
      .addOption(toCommanderOption(cmdBuildFilterOptions.withoutPathStarting))
      .addOption(toCommanderOption(cmdBuildFilterOptions.withExtension))
      .addOption(toCommanderOption(cmdBuildFilterOptions.withoutExtension))
      .addOption(toCommanderOption(cmdBuildFilterOptions.withPathSegment))
      .addOption(toCommanderOption(cmdBuildFilterOptions.withoutPathSegment))
      .addOption(toCommanderOption(cmdBuildFilterOptions.withTag))
      .addOption(toCommanderOption(cmdBuildFilterOptions.withoutTag))
      .addOption(toCommanderOption(cmdBuildFilterOptions.withTagStarting))
      .addOption(toCommanderOption(cmdBuildFilterOptions.withoutTagStarting))
      .action(async (aim: string, options: BuildActionRawOpts) => {
        const {
          reportBase,
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
        } = options;
        const buildOpts: BuildActionOpts = {
          flags: toSupportedFlags([`aim:${aim}`]),
          fileSearching: {
            pathInfos: [],
            filtering: {
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
            },
          },
          reportBase,
        };
        const ctx: RunnerContext = {
          currentPath: process.cwd(),
          termFormatter: basicFormatter,
          errTermFormatter: errorFormatter,
        };
        await buildAction(ctx, buildOpts);
      });
  }

  async parseAsync(argv: string[]) {
    return await this._program.parseAsync(argv, { from: 'node' });
  }

  async parseAsyncArgv() {
    return await this.parseAsync(process.argv);
  }
}
