import {
  LintInstructionResult,
  LintResolvedOpts,
  MicroInstruction,
  PathInfo,
  RunnerContext,
} from './model';
import { toMergedPathInfos, toPathInfo } from './path-transforming';
import { readFile } from 'fs/promises';
import path from 'path';
import { byFileQuery, commanderStringsToFiltering } from './path-filtering';
import glob from 'tiny-glob';
import { createESLint, lintCommand } from './eslint-command';

export const runFilesInstruction = (
  _ctx: RunnerContext,
  instruction: MicroInstruction
): PathInfo[] => {
  const {
    params: { targetFiles },
  } = instruction;
  return targetFiles.map(toPathInfo);
};

const readUtf8File = (currentPath: string) => (filename: string) =>
  readFile(path.join(currentPath, filename), { encoding: 'utf8' });

export const runLoadInstruction = async (
  ctx: RunnerContext,
  instruction: MicroInstruction
): Promise<PathInfo[]> => {
  const {
    params: { targetFiles },
  } = instruction;
  const contents = await Promise.all(
    targetFiles.map(readUtf8File(ctx.currentPath))
  );
  const pathInfos = toMergedPathInfos(contents);
  return pathInfos;
};

export const runGlobInstruction = async (
  ctx: RunnerContext,
  instruction: MicroInstruction
): Promise<PathInfo[]> => {
  const {
    params: { targetFiles },
  } = instruction;
  const opts = {
    cwd: ctx.currentPath,
    filesOnly: true,
  };
  const globWithOpts = async (globString: string) =>
    await glob(globString, opts);
  const matchedFiles = await Promise.all(targetFiles.map(globWithOpts));
  return matchedFiles.flat().map(toPathInfo);
};

export const runFilterInstruction = (
  _ctx: RunnerContext,
  instruction: MicroInstruction,
  pathInfos: PathInfo[]
): PathInfo[] => {
  const {
    params: { query },
  } = instruction;
  const filtering = commanderStringsToFiltering(query);
  return pathInfos.filter(byFileQuery(filtering));
};

export const runLintInstruction = async (
  ctx: RunnerContext,
  instruction: MicroInstruction,
  _pathInfos: PathInfo[]
): Promise<LintInstructionResult> => {
  const {
    params: { targetFiles },
  } = instruction;
  const lintOpts: LintResolvedOpts = {
    modulePath: ctx.currentPath,
    mode: 'check',
    folders: targetFiles,
  };
  const handle = await createESLint(lintOpts);
  const lintResults = await lintCommand(handle);
  const text = handle.formatter.format(lintResults);
  const json = handle.jsonFormatter.format(lintResults);
  return { text, json, status: 'ok', lintResults };
};

export const runInstructions = async (
  ctx: RunnerContext,
  instructions: MicroInstruction[]
): Promise<any> => {
  const filesInstruction = instructions.find((instr) => instr.name === 'files');
  const loadInstruction = instructions.find((instr) => instr.name === 'load');
  const globInstruction = instructions.find((instr) => instr.name === 'glob');
  const filterInstruction = instructions.find(
    (instr) => instr.name === 'filter'
  );
  const lintInstruction = instructions.find((instr) => instr.name === 'lint');

  const files = filesInstruction
    ? runFilesInstruction(ctx, filesInstruction)
    : [];
  const loaded = loadInstruction
    ? await runLoadInstruction(ctx, loadInstruction)
    : [];
  const globed = globInstruction
    ? await runGlobInstruction(ctx, globInstruction)
    : [];

  const allFileInfos = [...files, ...loaded, ...globed];
  const filtered = filterInstruction
    ? runFilterInstruction(ctx, filterInstruction, allFileInfos)
    : allFileInfos;
  const linted = lintInstruction
    ? await runLintInstruction(ctx, lintInstruction, filtered)
    : false;
  return linted ? linted : 'not linted';
};
