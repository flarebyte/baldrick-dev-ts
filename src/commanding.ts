import { Command } from 'commander';
import { version } from './version';
import { CommandingInstrumentation } from './commanding-instrumentation';
import {
  GlobAction,
  LintAction,
  LintActionOpts,
  LintActionRawOpts,
  RunnerContext,
  TestAction,
  TestActionOpts,
  TestActionRawOpts,
} from './model';
import { toCommanderArgument, toCommanderOption } from './commanding-helper';
import { cmdLintFilterOptions, cmdTestFilterOptions } from './commanding-data';
import { basicFormatter } from '../src/term-formatter';

export class Commanding {
  _instr: CommandingInstrumentation = new CommandingInstrumentation();
  _program: Command = new Command();
  constructor() {
    this._program.version(version);
  }
  getInstrumentation() {
    return this._instr;
  }
  declareGlobAction(globAction: GlobAction) {
    this._program
      .command('do')
      .argument('[script...]')
      .description('Run a glob script')
      .action((script: string[]) => {
        this._instr.globActionStart(script);
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
      .action(async (aim, options: LintActionRawOpts) => {
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
          flags: [`lint:${aim}`, `ecma:${options.ecmaVersion}`],
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
          ecmaVersion: parseInt(options.ecmaVersion),
          reportBase,
        };
        const ctx: RunnerContext = {
          currentPath: process.cwd(),
          termFormatter: basicFormatter,
        };
        this._instr.lintActionStart(ctx, lintOpts);
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
      .action(async (aim, options: TestActionRawOpts) => {
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
          flags: [`test:${aim}`],
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
        };
        this._instr.testActionStart(ctx, testOpts);
        await testAction(ctx, testOpts);
      });
  }

  async parseAsync(argv: string[]) {
    return await this._program.parseAsync(argv, { from: 'node' });
  }

  async parseAsyncArgv() {
    return await this.parseAsync(process.argv);
  }
}
