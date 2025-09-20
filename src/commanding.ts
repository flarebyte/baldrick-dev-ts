import { Command } from "commander";
import { basicFormatter, errorFormatter } from "../src/term-formatter.js";
import {
	cmdLintFilterOptions,
	cmdMarkdownFilterOptions,
	cmdReleaseOptions,
	cmdTestFilterOptions,
} from "./commanding-data.js";
import {
	splitReportBase,
	toCommanderArgument,
	toCommanderOption,
	toSupportedEcma,
} from "./commanding-helper.js";
import { toSupportedFlags } from "./flag-helper.js";
import type {
	LintAction,
	LintActionOpts,
	LintActionRawOpts,
	MarkdownAction,
	MarkdownActionOpts,
	MarkdownActionRawOpts,
	ReleaseAction,
	ReleaseActionOpts,
	RunnerContext,
	SupportedFlag,
	TestAction,
	TestActionOpts,
	TestActionRawOpts,
} from "./model.js";
import { version } from "./version.js";

const checkStyle = (
	search: string,
	style: string | string[],
	flag: SupportedFlag,
): string[] => {
	const styles = Array.isArray(style) ? style : [style];
	const found = styles.map((s) => s.trim()).find((s) => s === search);
	return typeof found === "string" ? [flag] : [];
};

export class Commanding {
	_program: Command = new Command();
	constructor() {
		this._program.version(version);
	}

	declareLintAction(lintAction: LintAction) {
		this._program
			.command("lint")
			.description("Lint the code")
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
			.addOption(toCommanderOption(cmdLintFilterOptions.style))
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
					ecmaVersion,
					style,
				} = options;
				const lintOpts: LintActionOpts = {
					flags: toSupportedFlags([
						`aim:${aim}`,
						...checkStyle("fp", style, "paradigm:fp"),
					]),
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
						useGlob: "auto",
					},
					ecmaVersion: toSupportedEcma(ecmaVersion),
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
			.command("test")
			.description("Test the code")
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
						useGlob: "auto",
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
			.command("markdown")
			.description("Process markdown documents")
			.addArgument(toCommanderArgument(cmdMarkdownFilterOptions.aim))
			.addOption(toCommanderOption(cmdMarkdownFilterOptions.reportBase))
			.addOption(toCommanderOption(cmdMarkdownFilterOptions.withPathStarting))
			.addOption(
				toCommanderOption(cmdMarkdownFilterOptions.withoutPathStarting),
			)
			.addOption(toCommanderOption(cmdMarkdownFilterOptions.withExtension))
			.addOption(toCommanderOption(cmdMarkdownFilterOptions.withoutExtension))
			.addOption(toCommanderOption(cmdMarkdownFilterOptions.withPathSegment))
			.addOption(toCommanderOption(cmdMarkdownFilterOptions.withoutPathSegment))
			.addOption(toCommanderOption(cmdMarkdownFilterOptions.withTag))
			.addOption(toCommanderOption(cmdMarkdownFilterOptions.withoutTag))
			.addOption(toCommanderOption(cmdMarkdownFilterOptions.withTagStarting))
			.addOption(toCommanderOption(cmdMarkdownFilterOptions.withoutTagStarting))
			.action(async (aim: string, options: MarkdownActionRawOpts) => {
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
				const markdownOpts: MarkdownActionOpts = {
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
						useGlob: "yes",
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

	declareReleaseAction(releaseAction: ReleaseAction) {
		this._program
			.command("release")
			.description("Publish and release the current project")
			.addArgument(toCommanderArgument(cmdReleaseOptions.aim))
			.action(async (aim: string) => {
				const ctx: RunnerContext = {
					currentPath: process.cwd(),
					termFormatter: basicFormatter,
					errTermFormatter: errorFormatter,
				};
				const releaseOpts: ReleaseActionOpts = {
					flags: toSupportedFlags([`aim:${aim}`]),
				};
				await releaseAction(ctx, releaseOpts);
			});
	}

	async parseAsync(argv: string[]) {
		return await this._program.parseAsync(argv, { from: "node" });
	}

	async parseAsyncArgv() {
		return await this.parseAsync(process.argv);
	}
}
