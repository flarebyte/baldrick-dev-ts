import { readFile } from "node:fs/promises";
import path from "node:path";
import glob from "tiny-glob";
// import { outputFile } from 'fs-extra';
import { satisfyFlag } from "./flag-helper.js";
import type {
	BasicInstructionResult,
	InstructionStatus,
	MarkdownInstructionResult,
	MarkdownResolvedOpts,
	MicroInstruction,
	PathInfo,
	RunnerContext,
	TermFormatterParams,
} from "./model.js";
import { byFileQuery, commanderStringsToFiltering } from "./path-filtering.js";
import { asPath, toMergedPathInfos, toPathInfo } from "./path-transforming.js";
import { runMdPrettier } from "./prettier-md-helper.js";
import { runMdRemark } from "./remark-md-helper.js";
import { getVersionsSummary } from "./versions-summary.js";

const instructionToTermIntro = (
	instruction: MicroInstruction,
): TermFormatterParams => ({
	kind: "intro",
	title: `Starting ${instruction.name} ...`,
	detail: instruction.params,
	format: "human",
});

/** Translate a static file list into PathInfos. */
export const runFilesInstruction = (
	ctx: RunnerContext,
	instruction: MicroInstruction & { name: "files" },
): PathInfo[] => {
	ctx.termFormatter(instructionToTermIntro(instruction));
	const {
		params: { targetFiles },
	} = instruction;
	return (targetFiles || []).map(toPathInfo);
};

const readUtf8File = (currentPath: string) => (filename: string) =>
	readFile(path.join(currentPath, filename), { encoding: "utf8" });

/** Load file lists from text files and merge them into PathInfos. */
export const runLoadInstruction = async (
	ctx: RunnerContext,
	instruction: MicroInstruction & { name: "load" },
): Promise<PathInfo[]> => {
	ctx.termFormatter(instructionToTermIntro(instruction));
	const {
		name,
		params: { targetFiles },
	} = instruction;
	const contents = await Promise.all(
		(targetFiles || []).map(readUtf8File(ctx.currentPath)),
	);
	const pathInfos = toMergedPathInfos(contents);
	ctx.termFormatter({
		title: `Finished ${name}`,
		detail: `${pathInfos.length} files loaded`,
		kind: "info",
		format: "default",
	});
	return pathInfos;
};

/** Run a glob search and convert matches into PathInfos. */
export const runGlobInstruction = async (
	ctx: RunnerContext,
	instruction: MicroInstruction & { name: "glob" },
): Promise<PathInfo[]> => {
	ctx.termFormatter(instructionToTermIntro(instruction));
	const {
		params: { targetFiles },
	} = instruction;
	const opts = {
		cwd: ctx.currentPath,
		filesOnly: true,
	};
	const globWithOpts = async (globString: string) =>
		await glob(globString, opts);
	const matchedFiles = await Promise.all((targetFiles || []).map(globWithOpts));
	return matchedFiles.flat().map(toPathInfo);
};

/** Wrapper adding timing and error handling around globbing. */
export const runGlobInstructionWithCatch = async (
	ctx: RunnerContext,
	instruction: MicroInstruction & { name: "glob" },
): Promise<PathInfo[]> => {
	try {
		const started = Date.now();
		const results = await runGlobInstruction(ctx, instruction);
		const finished = Date.now();
		const delta_seconds = ((finished - started) / 1000).toFixed(1);
		ctx.termFormatter({
			title: "Globbing - finished",
			detail: `Took ${delta_seconds} seconds. Found ${results.length} files`,
			format: "default",
			kind: "success",
		});
		return results;
	} catch (error) {
		ctx.errTermFormatter({
			title: "Globbing - error",
			detail: error,
		});
		throw error;
	}
};

/** Apply filtering to a list of PathInfos. */
export const runFilterInstruction = (
	ctx: RunnerContext,
	instruction: MicroInstruction & { name: "filter" },
	pathInfos: PathInfo[],
): PathInfo[] => {
	ctx.termFormatter(instructionToTermIntro(instruction));
	const {
		params: { query },
	} = instruction;
	const filtering = commanderStringsToFiltering(query || []);
	const filtered = pathInfos.filter(byFileQuery(filtering));
	ctx.termFormatter({
		title: "Filtering done",
		detail: `From ${pathInfos.length} files to ${filtered.length} files`,
		format: "default",
		kind: "info",
	});
	return filtered;
};

// Lint and Test instruction implementations removed (out of scope)

const runMarkdownInstruction = async (
	ctx: RunnerContext,
	instruction: MicroInstruction & { name: "markdown" },
	pathInfos: PathInfo[],
): Promise<MarkdownInstructionResult> => {
	ctx.termFormatter(instructionToTermIntro(instruction));
	const {
		params: { reportDirectory, reportPrefix, flags },
	} = instruction;

	const pathPatterns = pathInfos.map(asPath);
	const markdownOpts: MarkdownResolvedOpts = {
		modulePath: ctx.currentPath,
		flags,
		pathPatterns,
		outputDirectory: reportDirectory,
		outputName: reportPrefix,
	};

	ctx.termFormatter({
		title: "Markdown - final opts",
		detail: markdownOpts,
		kind: "info",
		format: "human",
	});

	const shouldFix = satisfyFlag("aim:fix", flags);
	if (shouldFix) {
		await runMdPrettier(pathPatterns);
	}
	const shouldCheck = satisfyFlag("aim:check", flags);
	if (shouldCheck) {
		await runMdRemark(markdownOpts, pathPatterns);
	}

	return { status: "ok" };
};

/** Wrapper for the markdown processing instruction with timing and logging. */
export const runMarkdownInstructionWithCatch = async (
	ctx: RunnerContext,
	instruction: MicroInstruction & { name: "markdown" },
	pathInfos: PathInfo[],
): Promise<BasicInstructionResult> => {
	try {
		const started = Date.now();
		await runMarkdownInstruction(ctx, instruction, pathInfos);
		const finished = Date.now();
		const delta_seconds = ((finished - started) / 1000).toFixed(1);
		ctx.termFormatter({
			title: "Markdown - finished",
			detail: `Took ${delta_seconds} seconds`,
			format: "default",
			kind: "success",
		});
	} catch (error) {
		ctx.errTermFormatter({
			title: "Markdown - markdown error",
			detail: error,
		});
		throw error;
	}
	return { status: "ok" };
};

/** Execute the provided micro-instructions in order and report overall status. */
export const runInstructions = async (
	ctx: RunnerContext,
	instructions: MicroInstruction[],
): Promise<InstructionStatus> => {
	const filesInstruction = instructions.find((instr) => instr.name === "files");
	const loadInstruction = instructions.find((instr) => instr.name === "load");
	const globInstruction = instructions.find((instr) => instr.name === "glob");
	const filterInstruction = instructions.find(
		(instr) => instr.name === "filter",
	);
	const markdownInstruction = instructions.find(
		(instr) => instr.name === "markdown",
	);
	const versionsSummary = await getVersionsSummary();
	ctx.termFormatter({
		title: "Run instructions",
		detail: versionsSummary,
		kind: "intro",
		format: "default",
	});
	const files =
		filesInstruction && filesInstruction.name === "files"
			? runFilesInstruction(ctx, filesInstruction)
			: [];
	const loaded =
		loadInstruction && loadInstruction.name === "load"
			? await runLoadInstruction(ctx, loadInstruction)
			: [];
	const globed =
		globInstruction && globInstruction.name === "glob"
			? await runGlobInstructionWithCatch(ctx, globInstruction)
			: [];

	const allFileInfos = [...files, ...loaded, ...globed];
	const filtered =
		filterInstruction && filterInstruction.name === "filter"
			? runFilterInstruction(ctx, filterInstruction, allFileInfos)
			: allFileInfos;
	// Lint and test are no-ops in the reduced scope
	// lint/test disabled in reduced scope

	const markdowned =
		markdownInstruction && markdownInstruction.name === "markdown"
			? await runMarkdownInstructionWithCatch(
					ctx,
					markdownInstruction,
					filtered,
				)
			: false;

	if (markdowned) {
		return markdowned.status;
	}
	return "ko";
};
