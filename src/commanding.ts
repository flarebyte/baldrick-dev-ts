import { Command, Argument, Option, InvalidArgumentError } from 'commander';
import { version } from './version';
import { CommandingInstrumentation } from './commanding-instrumentation';
import { GlobAction, LintAction, LintActionOpts } from './model';
import { toPathInfo } from './path-transforming';

function parseEcma(value: string): number {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('A valid Ecma version should be a number');
  }
  if (parsedValue < 2000) {
    throw new InvalidArgumentError('Not a valid Ecma version');
  }
  return parsedValue;
}

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
      .option(
        '-start, --with-path-starting [withPathStarting...]',
        'specify a start of paths'
      )
      .option(
        '-noStart, --without-path-starting [withoutPathStarting...]',
        'exclude a start of path'
      )
      .option(
        '-ext, --with-extension [withExtension...]',
        'specify a file extension'
      )
      .option(
        '-noExt, --without-extension [withoutExtension...]',
        'Without a file extension'
      )
      .option(
        '-seg, --with-path-segment [withPathSegment...]',
        'specify a segment of path'
      )
      .option(
        '-noSeg, --without-path-segment [withoutPathSegment...]',
        'Without a segment of path'
      )
      .option('-tag, --with-tag [withTag...]', 'specify a tag')
      .option('-noTag, --without-tag [withoutTag...]', 'Without a tag')
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
