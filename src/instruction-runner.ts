import { MicroInstruction, PathInfo, RunnerContext } from './model';
import { toMergedPathInfos, toPathInfo } from './path-transforming';
import { readFile } from 'fs/promises';
import path from 'path';
import { byFileQuery, commanderStringsToFiltering } from './path-filtering';

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

const runGlobInstruction = async (
  _instruction: MicroInstruction
): Promise<PathInfo[]> => {
  return await Promise.resolve([]);
};

const runFilterInstruction = (
  instruction: MicroInstruction,
  pathInfos: PathInfo[]
): PathInfo[] => {
  const {
    params: { query },
  } = instruction;
  const filtering = commanderStringsToFiltering(query);
  return pathInfos.filter(byFileQuery(filtering));
};

const runLintInstruction = async (
  _instruction: MicroInstruction,
  _pathInfos: PathInfo[]
): Promise<string> => {
  return await Promise.resolve('123');
};

export const runInstructions = async (
  ctx: RunnerContext,
  instructions: MicroInstruction[]
): Promise<string> => {
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
    ? await runGlobInstruction(globInstruction)
    : [];

  const allFileInfos = [...files, ...loaded, ...globed];
  const filtered = filterInstruction
    ? runFilterInstruction(filterInstruction, allFileInfos)
    : allFileInfos;
  const linted = lintInstruction
    ? await runLintInstruction(lintInstruction, filtered)
    : false;
  return linted ? linted : 'not linted';
};
