import { readFile, writeFile } from "node:fs/promises";
import prettier, { type Options } from "prettier";
import { computePrettierMdConfig } from "./prettier-md-config.js";
import { fixMdRemarkContent } from "./remark-md-helper.js";
import { normalizeMdLine } from "./text-helper.js";

const { format } = prettier;
const filesLimit = 200;
const runMdPrettierOnFile =
	(prettierOpts: Options) => async (filename: string) => {
		const content = await readFile(filename, "utf8");
    const formatted = await format(content, prettierOpts);
		const lines = formatted.split("\n");
		const fixedLines = lines.map(normalizeMdLine);
		const customFix = fixedLines.join("\n");
		const remarked = await fixMdRemarkContent(customFix);
		writeFile(filename, remarked, "utf8");
	};

/** Format and normalize a set of markdown files using Prettier and remark rules. */
export const runMdPrettier = async (filenames: string[]) => {
	if (filenames.length > filesLimit) {
		throw new Error(`Too many files to process: ${filenames.length}`);
	}
	if (filenames.length === 0) {
		throw new Error("You need at least one file to process");
	}
	const prettierConfig = computePrettierMdConfig();
	const jobs = filenames.map(runMdPrettierOnFile(prettierConfig));
	await Promise.all(jobs);
};
