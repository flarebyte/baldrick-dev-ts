import path from "node:path";
import { Argument, Option } from "commander";
import type { CmdOption, SupportedEcmaVersion } from "./model.js";

const capitalize = (value: string): string =>
	value.length > 0 ? (value[0] || "").toUpperCase() + value.slice(1) : "";

const decapitalize = (value: string): string =>
	value.length > 0 ? (value[0] || "").toLowerCase() + value.slice(1) : "";

export const toCamelCase = (longFlag: string): string =>
	decapitalize(longFlag.split("-").map(capitalize).join(""));

export const toCommanderOption = (option: CmdOption): Option => {
	const flags = `-${option.shortFlag}, --${option.longFlag} [${toCamelCase(
		option.longFlag,
	)}...]`;
	const opts = new Option(flags, option.description);
	opts.defaultValue = option.defaultValue;
	if (option.choices.length > 0) {
		opts.choices(option.choices);
	}
	return opts;
};

export const toCommanderArgument = (option: CmdOption): Argument => {
	const opts = new Argument(`<${option.longFlag}>`, option.description);
	if (option.choices.length > 0) {
		opts.choices(option.choices);
	}
	return opts;
};

const supportedEcma: SupportedEcmaVersion[] = [2020, 2021, 2022];

export const toSupportedEcma = (givenEcma: string): SupportedEcmaVersion => {
	const found = supportedEcma.find((f) => f === Number.parseInt(givenEcma, 10));
	if (!found) {
		throw new Error(`This Ecma version is not supported yet ${givenEcma}`);
	}
	return found;
};

export const splitReportBase = (
	reportBase: string,
): { reportDirectory: string; reportPrefix: string } => ({
	reportDirectory: path.dirname(reportBase),
	reportPrefix: path.basename(reportBase),
});
