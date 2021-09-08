import { Command, Argument } from 'commander';
import { version } from './version';
import { CommandingInstrumentation } from './commanding-instrumentation';
import { GlobAction, LintAction, LintActionOpts } from './model';
import { toPathInfo } from './path-transforming';
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
      .addArgument(
        new Argument('<mode>', 'mode').choices(['find', 'list', 'load'])
      )
      .argument('<paths...>', 'List of paths')
      .addOption(toCommanderOption(cmdLintFilterOptions.withPathStarting))
      .addOption(toCommanderOption(cmdLintFilterOptions.withoutPathStarting))
      .addOption(toCommanderOption(cmdLintFilterOptions.withExtension))
      .addOption(toCommanderOption(cmdLintFilterOptions.withoutExtension))
      .addOption(toCommanderOption(cmdLintFilterOptions.withPathSegment))
      .addOption(toCommanderOption(cmdLintFilterOptions.withoutPathSegment))
      .addOption(toCommanderOption(cmdLintFilterOptions.withTag))
      .addOption(toCommanderOption(cmdLintFilterOptions.withoutTag))
      .option(
        '-ecma, --ecma-version [ecmaVersion...]',
        'specify the ecma version',
        parseEcma
      )
      .action(
        (
          mode: string,
          paths: string[],
          withPathStarting: string[],
          withoutPathStarting: string[],
          withExtension: string[],
          withoutExtension: string[],
          withPathSegment: string[],
          withoutPathSegment: string[],
          withTag: string[],
          withoutTag: string[],
          ecmaVersion: number
        ) => {
          const lintOpts: LintActionOpts = {
            searchMode: mode,
            pathInfos: paths.map(toPathInfo),
            fileFiltering: {
              withPathStarting,
              withoutPathStarting,
              withExtension,
              withoutExtension,
              withPathSegment,
              withoutPathSegment,
              withTag,
              withoutTag,
            },
            ecmaVersion,
            report: [],
          };
          this._instr.lintActionStart(lintOpts);
          lintAction(lintOpts);
        }
      );
  }

  parse(argv: string[]) {
    this._program.parse(argv, { from: 'node' });
  }
}
