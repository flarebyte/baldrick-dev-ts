import { Command } from 'commander';
import { version } from './version';
import { CommandingInstrumentation } from './commanding-instrumentation';
import { GlobAction, LintAction, LintActionOpts, RunnerContext } from './model';
import { parseEcma, toCommanderOption } from './commanding-helper';
import { cmdLintFilterOptions } from './commanding-data';

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
        console.log('>>inside', script);
        this._instr.globActionStart(script);
        globAction(script);
      });
  }
  declareLintAction(lintAction: LintAction) {
    this._program
      .command('lint')
      .description('Lint the code')
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
      .option(
        '-ecma, --ecma-version [ecmaVersion...]',
        'specify the ecma version',
        parseEcma,
        2020
      )
      .action(
       async (
          withPathStarting: string[],
          withoutPathStarting: string[],
          withExtension: string[],
          withoutExtension: string[],
          withPathSegment: string[],
          withoutPathSegment: string[],
          withTag: string[],
          withoutTag: string[],
          withTagStarting: string[],
          withoutTagStarting: string[],
          ecmaVersion: number,
        ) => {
          const lintOpts: LintActionOpts = {
            flags: [`lint:check`],
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
            ecmaVersion,
            report: [],
          };
          const ctx: RunnerContext = {
            currentPath: process.cwd(),
          };
          this._instr.lintActionStart(ctx, lintOpts);
          await lintAction(ctx, lintOpts);
        }
      );
  }

  parse(argv: string[]) {
    this._program.parse(argv, { from: 'node' });
  }
}
