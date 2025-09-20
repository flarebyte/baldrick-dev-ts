import { runReleaseActionWithCatch } from "./action-release.js";
import { toMarkdownInstructions } from "./instruction-building.js";
import { runInstructions } from "./instruction-runner.js";
import type {
	LintAction,
	MarkdownAction,
	MarkdownActionOpts,
	ReleaseAction,
	ReleaseActionOpts,
	RunnerContext,
	TestAction,
} from "./model.js";

/**
 * Deprecated lint action. Prints a deprecation message.
 */
export const cmdLintAction: LintAction = async (ctx: RunnerContext) => {
	ctx.termFormatter({
		title: "Lint - no longer supported",
		detail:
			"The lint command has been deprecated and is no longer supported in this project scope.",
		kind: "info",
		format: "default",
	});
};

/**
 * Deprecated test action. Prints a deprecation message.
 */
export const cmdTestAction: TestAction = async (ctx: RunnerContext) => {
	ctx.termFormatter({
		title: "Test - no longer supported",
		detail:
			"The test command has been deprecated and is no longer supported in this project scope.",
		kind: "info",
		format: "default",
	});
};

/**
 * Run markdown instructions according to provided options.
 */
export const cmdMarkdownAction: MarkdownAction = async (
	ctx: RunnerContext,
	options: MarkdownActionOpts,
) => {
	const instructions = toMarkdownInstructions(options);
	const status = await runInstructions(ctx, instructions);
	if (status === "ko") {
		throw new Error("Markdown action did fail !");
	}
};

/**
 * Run the release flow with error handling.
 */
export const cmdReleaseAction: ReleaseAction = async (
	ctx: RunnerContext,
	options: ReleaseActionOpts,
) => {
	const status = await runReleaseActionWithCatch(ctx, options);
	if (status === "ko") {
		throw new Error("Release action did fail !");
	}
};
