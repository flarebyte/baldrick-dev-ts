import { Command } from 'commander';
import { version } from './version.js';
import {
  MarkdownAction,
  MarkdownActionOpts,
  MarkdownActionRawOpts,
  GlobAction,
  LintAction,
  LintActionOpts,
  LintActionRawOpts,
  RunnerContext,
  TestAction,
  TestActionOpts,
  TestActionRawOpts,
} from './model';
import {
  splitReportBase,
  toCommanderArgument,
  toCommanderOption,
  toSupportedEcma,
} from './commanding-helper.js';
import {
  cmdMarkdownFilterOptions,
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
          ...splitReportBase(reportBase),
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
      .action(async (aim: string, options: TestActionRawOpts) => {
        const { reportBase, displayName, withPathStarting } = options;
        const testOpts: TestActionOpts = {
          flags: toSupportedFlags([`aim:${aim}`]),
          fileSearching: {
            pathInfos: [],
            filtering: {
              withPathStarting,
              withoutPathStarting: [],
              withExtension: [],
              withoutExtension: [],
              withPathSegment: [],
              withoutPathSegment: [],
              withTag: [],
              withoutTag: [],
              withTagStarting: [],
              withoutTagStarting: [],
            },
          },
          reportBase,
          displayName,
          ...splitReportBase(reportBase),
        };
        const ctx: RunnerContext = {
          currentPath: process.cwd(),
          termFormatter: basicFormatter,
          errTermFormatter: errorFormatter,
        };
        await testAction(ctx, testOpts);
      });
  }

  declareMarkdownAction(markdownAction: MarkdownAction) {
    this._program
      .command('markdown')
      .description('Markdown the code')
      .addArgument(toCommanderArgument(cmdMarkdownFilterOptions.aim))
      .addOption(toCommanderOption(cmdMarkdownFilterOptions.reportBase))
      .addOption(toCommanderOption(cmdMarkdownFilterOptions.withPathStarting))
      .action(async (aim: string, options: MarkdownActionRawOpts) => {
        const { reportBase, withPathStarting } = options;
        const markdownOpts: MarkdownActionOpts = {
          flags: toSupportedFlags([`aim:${aim}`]),
          fileSearching: {
            pathInfos: [],
            filtering: {
              withPathStarting,
              withoutPathStarting: [],
              withExtension: [],
              withoutExtension: [],
              withPathSegment: [],
              withoutPathSegment: [],
              withTag: [],
              withoutTag: [],
              withTagStarting: [],
              withoutTagStarting: [],
            },
          },
          reportBase,
          ...splitReportBase(reportBase),
        };
        const ctx: RunnerContext = {
          currentPath: process.cwd(),
          termFormatter: basicFormatter,
          errTermFormatter: errorFormatter,
        };
        await markdownAction(ctx, markdownOpts);
      });
  }

  async parseAsync(argv: string[]) {
    return await this._program.parseAsync(argv, { from: 'node' });
  }

  async parseAsyncArgv() {
    return await this.parseAsync(process.argv);
  }
}
