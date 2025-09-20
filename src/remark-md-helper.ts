import fs, { readFile } from "node:fs/promises";
import path from "node:path";
import { ensureDir } from "fs-extra";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkLintEmphasisMarker from "remark-lint-emphasis-marker";
import remarkLintListItemIndent from "remark-lint-list-item-indent";
import remarkLintListItemSpacing from "remark-lint-list-item-spacing";
import remarkLintMaximumHeadingLength from "remark-lint-maximum-heading-length";
import remarkLintMaximumLineLength from "remark-lint-maximum-line-length";
import remarkLintOrderedListMarkerStyle from "remark-lint-ordered-list-marker-style";
import remarkLintOrderedListMarkerValue from "remark-lint-ordered-list-marker-value";
import remarkLintStrongMarker from "remark-lint-strong-marker";
import remarkLintUnorderedListMarkerStyle from "remark-lint-unordered-list-marker-style";
import remarkPresetLintConsistent from "remark-preset-lint-consistent";
import remarkPresetLintRecommended from "remark-preset-lint-recommended";
import type { VFile } from "vfile";
import { reporter } from "vfile-reporter";
import { reporterJson } from "vfile-reporter-json";
import type { MarkdownResolvedOpts } from "./model.js";
import { basicFormatter, errorFormatter } from "./term-formatter.js";

const filesLimit = 200;

const formatWarnings = (filename: string, vfile: VFile) => {
	errorFormatter({
		title: `Linting markdown failed (${vfile.messages.length}) for ${filename}`,
		detail: `\n${reporter(vfile)}`,
	});
};

const formatSuccess = (filename: string, vfile: VFile) => {
	basicFormatter({
		title: `Linting markdown succeed for ${filename}`,
		detail: `\n${reporter(vfile)}`,
		kind: "success",
		format: "default",
	});
};

const formatJsonWarnings = async (opts: MarkdownResolvedOpts, vfile: VFile) => {
	const content = reporterJson(vfile);
	const pathName = path.join(
		opts.outputDirectory,
		`${opts.outputName}-remark.json`,
	);
	const singleLineJson = `${JSON.stringify(JSON.parse(content))}\n`;
	await fs.appendFile(pathName, singleLineJson);
};

/**
 * @see https://github.com/codacy/codacy-remark-lint
 */
const createRemark = () =>
	remark()
		.use(remarkPresetLintConsistent)
		.use(remarkPresetLintRecommended)
		.use(remarkGfm)
		.use(remarkLintMaximumLineLength)
		.use(remarkLintMaximumHeadingLength)
		.use(remarkLintListItemIndent)
		.use(remarkLintOrderedListMarkerValue)
		.use(remarkLintListItemSpacing)
		.use(remarkLintStrongMarker, "*")
		.use(remarkLintEmphasisMarker, "_")
		.use(remarkLintUnorderedListMarkerStyle, "-")
		.use(remarkLintOrderedListMarkerStyle, ".")
		.use(remarkLintOrderedListMarkerValue, "ordered");

const runMdRemarkOnFile =
	(opts: MarkdownResolvedOpts) => async (filename: string) => {
		const content = await readFile(filename, "utf8");
		await createRemark()
			.process(content)
			.then(
				async (file) => {
					file.basename = path.basename(filename);
					if (file.messages.length === 0) {
						formatSuccess(filename, file);
					} else {
						formatWarnings(filename, file);
					}

					await formatJsonWarnings(opts, file);
				},
				(error) => {
					throw error;
				},
			);
	};

/** Run remark checks and write JSON report entries. */
export const runMdRemark = async (
	opts: MarkdownResolvedOpts,
	filenames: string[],
) => {
	if (filenames.length > filesLimit) {
		throw new Error(`Too many files to process: ${filenames.length}`);
	}
	if (filenames.length === 0) {
		throw new Error("You need at least one file to process");
	}

	await ensureDir(opts.outputDirectory);

	const jobs = filenames.map(runMdRemarkOnFile(opts));
	await Promise.all(jobs);
};

/** Apply remark-based normalization to a markdown string and return the new content. */
export const fixMdRemarkContent = async (content: string) => {
  const newContent = await createRemark()
    // Cast to any to accommodate settings changes across remark versions
    .data(
      "settings",
      {
        commonmark: true,
        emphasis: "_",
        strong: "*",
        bullet: "-",
        listItemIndent: "tab",
        incrementListMarker: true,
        fences: true,
      } as any,
    )
    .process(content);

	return String(newContent);
};
