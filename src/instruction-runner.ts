import { MicroInstruction, PathInfo } from './model';
import { toPathInfo } from './path-transforming';
import { readFile }from 'fs/promises';

const runFilesInstruction = (
  instruction: MicroInstruction
): PathInfo[] => {
  const {
    params: { targetFiles },
  } = instruction;
  return targetFiles.map(toPathInfo);
};

const runLoadInstruction = async (
  instruction: MicroInstruction
): Promise<PathInfo[]> => {
  const {
    params: { targetFiles },
  } = instruction;
  Promise.all(targetFiles.map(file => {
    return readFile(file, { encoding: 'utf8'});
  })).then(fileContents => {
    
  })
  return await Promise.resolve([]);
};

const runGlobInstruction = async (
  _instruction: MicroInstruction
): Promise<PathInfo[]> => {
  return await Promise.resolve([]);
};

const runFilterInstruction = (
  _instruction: MicroInstruction,
  pathInfos: PathInfo[]
): PathInfo[] => {
  return pathInfos;
};

const runLintInstruction = async (
  _instruction: MicroInstruction,
  _pathInfos: PathInfo[]
): Promise<string> => {
  return await Promise.resolve('123');
};

const runInstructions = async (
  instructions: MicroInstruction[]
): Promise<void> => {
  const filesInstruction = instructions.find((instr) => instr.name === 'files');
  const loadInstruction = instructions.find((instr) => instr.name === 'load');
  const globInstruction = instructions.find((instr) => instr.name === 'glob');
  const filterInstruction = instructions.find(
    (instr) => instr.name === 'filter'
  );
  const lintInstruction = instructions.find((instr) => instr.name === 'lint');

  const files = filesInstruction
    ? runFilesInstruction(filesInstruction)
    : [];
  const loaded = loadInstruction
    ? await runLoadInstruction(loadInstruction)
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
};
