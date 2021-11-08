import { Command } from 'commander';
import { version } from './version';
import { CommandingInstrumentation } from './commanding-instrumentation';
import {
  GlobAction,
  LintAction,
  LintActionOpts,
  LintActionRawOpts,
  RunnerContext,
} from './model';
import { toCommanderOption } from './commanding-helper';
import { cmdLintFilterOptions } from './commanding-data';
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
      .addOption(toCommanderOption(cmdLintFilterOptions.aim))
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
      .action(async (options: LintActionRawOpts) => {
        const {
          aim,
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
          report: [],
        };
        const ctx: RunnerContext = {
          currentPath: process.cwd(),
          termFormatter: basicFormatter,
        };
        this._instr.lintActionStart(ctx, lintOpts);
        await lintAction(ctx, lintOpts);
      });
  }

  async parseAsync(argv: string[]) {
    return await this._program.parseAsync(argv, { from: 'node' });
  }

  async parseAsyncArgv() {
    return await this.parseAsync(process.argv);
  }
}
