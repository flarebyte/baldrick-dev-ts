import {
  LintInstructionResult,
  InstructionStatus,
  LintResolvedOpts,
  MicroInstruction,
  PathInfo,
  RunnerContext,
  TermFormatterParams,
  TestResolvedOpts,
  TestInstructionResult,
  MarkdownInstructionResult,
  MarkdownResolvedOpts,
  BasicInstructionResult,
} from './model.js';
import { asPath, toMergedPathInfos, toPathInfo } from './path-transforming.js';
import { readFile } from 'fs/promises';
import path from 'path';
import { byFileQuery, commanderStringsToFiltering } from './path-filtering.js';
import glob from 'tiny-glob';
import { createESLint, lintCommand } from './eslint-helper.js';
import { outputFile } from 'fs-extra';
import { ESLint } from 'eslint';
import { createJest, jestCommand } from './jest-helper.js';
import { satisfyFlag } from './flag-helper.js';
import { runMdPrettier } from './prettier-md-helper.js';
import { runMdRemark } from './remark-md-helper.js';

const instructionToTermIntro = (
  instruction: MicroInstruction
): TermFormatterParams => ({
  kind: 'intro',
  title: `Starting ${instruction.name} ...`,
  detail: instruction.params,
  format: 'human',
});

export const runFilesInstruction = (
  ctx: RunnerContext,
  instruction: MicroInstruction & { name: 'files' }
): PathInfo[] => {
  ctx.termFormatter(instructionToTermIntro(instruction));
  const {
    params: { targetFiles },
  } = instruction;
  return (targetFiles || []).map(toPathInfo);
};

const readUtf8File = (currentPath: string) => (filename: string) =>
  readFile(path.join(currentPath, filename), { encoding: 'utf8' });

export const runLoadInstruction = async (
  ctx: RunnerContext,
  instruction: MicroInstruction & { name: 'load' }
): Promise<PathInfo[]> => {
  ctx.termFormatter(instructionToTermIntro(instruction));
  const {
    params: { targetFiles },
  } = instruction;
  const contents = await Promise.all(
    (targetFiles || []).map(readUtf8File(ctx.currentPath))
  );
  const pathInfos = toMergedPathInfos(contents);
  return pathInfos;
};

export const runGlobInstruction = async (
  ctx: RunnerContext,
  instruction: MicroInstruction & { name: 'glob' }
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

export const runGlobInstructionWithCatch = async (
  ctx: RunnerContext,
  instruction: MicroInstruction & { name: 'glob' }
): Promise<PathInfo[]> => {
  try {
    const started = new Date().getTime();
    const results = await runGlobInstruction(ctx, instruction);
    const finished = new Date().getTime();
    const delta_seconds = ((finished - started) / 1000).toFixed(1);
    ctx.termFormatter({
      title: 'Globbing - finished',
      detail: `Took ${delta_seconds} seconds`,
      format: 'default',
      kind: 'info',
    });
    return results;
  } catch (err) {
    ctx.errTermFormatter({
      title: 'Globbing - error',
      detail: err,
    });
    throw err;
  }
};

export const runFilterInstruction = (
  ctx: RunnerContext,
  instruction: MicroInstruction & { name: 'filter' },
  pathInfos: PathInfo[]
): PathInfo[] => {
  ctx.termFormatter(instructionToTermIntro(instruction));
  const {
    params: { query },
  } = instruction;
  const filtering = commanderStringsToFiltering(query || []);
  return pathInfos.filter(byFileQuery(filtering));
};

const toEslintStatus = (
  lintResults: ESLint.LintResult[]
): InstructionStatus => {
  const hasError = lintResults.some((res) => res.errorCount > 0);
  const hasWarning = lintResults.some((res) => res.warningCount > 0);
  return hasError ? 'ko' : hasWarning ? 'warning' : 'ok';
};

export const runLintInstruction = async (
  ctx: RunnerContext,
  instruction: MicroInstruction & { name: 'lint' },
  pathInfos: PathInfo[]
): Promise<LintInstructionResult> => {
  ctx.termFormatter(instructionToTermIntro(instruction));
  const {
    params: { targetFiles, reportBase, flags, ecmaVersion },
  } = instruction;
  const isCI = satisfyFlag('aim:ci', flags);
  const shouldFix = satisfyFlag('aim:fix', flags);
  const targetFilesOrEmpty = targetFiles || [];
  const pathPatterns = [...targetFilesOrEmpty, ...pathInfos.map(asPath)];
  const lintOpts: LintResolvedOpts = {
    modulePath: ctx.currentPath,
    flags,
    pathPatterns,
    ecmaVersion,
  };
  ctx.termFormatter({
    title: 'Linting - final opts',
    detail: lintOpts,
    kind: 'info',
    format: 'human',
  });
  const handle = await createESLint(lintOpts);
  const lintResults = await lintCommand(handle, shouldFix);
  const text = handle.formatter.format(lintResults);
  const json = handle.jsonFormatter.format(lintResults);
  const junitXml = handle.junitFormatter.format(lintResults);
  const compact = handle.compactFormatter.format(lintResults);
  const detail = isCI ? compact : text;
  ctx.termFormatter({
    title: 'Linting',
    detail,
    kind: 'info',
    format: 'default',
  });
  if (isCI) {
    await outputFile(`${reportBase}.json`, json, 'utf8');
    await outputFile(`${reportBase}.junit.xml`, junitXml, 'utf8');
  }
  const status = toEslintStatus(lintResults);
  return { text, json, junitXml, compact, status, lintResults };
};

export const runLintInstructionWithCatch = async (
  ctx: RunnerContext,
  instruction: MicroInstruction & { name: 'lint' },
  pathInfos: PathInfo[]
): Promise<BasicInstructionResult> => {
  try {
    const started = new Date().getTime();
    await runLintInstruction(ctx, instruction, pathInfos);
    const finished = new Date().getTime();
    const delta_seconds = ((finished - started) / 1000).toFixed(1);
    ctx.termFormatter({
      title: 'Linting - finished',
      detail: `Took ${delta_seconds} seconds`,
      format: 'default',
      kind: 'info',
    });
  } catch (err) {
    ctx.errTermFormatter({
      title: 'Linting - lint error',
      detail: err,
    });
    throw err;
  }
  return { status: 'ok' };
};

export const runTestInstruction = async (
  ctx: RunnerContext,
  instruction: MicroInstruction & { name: 'test' },
  pathInfos: PathInfo[]
): Promise<TestInstructionResult> => {
  ctx.termFormatter(instructionToTermIntro(instruction));
  const {
    params: { targetFiles, reportDirectory, reportPrefix, displayName, flags },
  } = instruction;

  const targetFilesOrEmpty = targetFiles || [];
  const pathPatterns = [...targetFilesOrEmpty, ...pathInfos.map(asPath)];
  const testOpts: TestResolvedOpts = {
    modulePath: ctx.currentPath,
    flags,
    pathPatterns,
    outputDirectory: reportDirectory,
    outputName: reportPrefix,
    displayName,
  };

  ctx.termFormatter({
    title: 'Testing - final opts',
    detail: testOpts,
    kind: 'info',
    format: 'human',
  });

  const handle = createJest(testOpts);

  ctx.termFormatter({
    title: 'Testing - jest config',
    detail: handle.config,
    kind: 'info',
    format: 'human',
  });

  ctx.termFormatter({
    title: 'Testing - jest argv',
    detail: handle.argv.join(' '),
    kind: 'info',
    format: 'default',
  });

  await jestCommand(handle);

  return { status: 'ok' };
};

export const runTestInstructionWithCatch = async (
  ctx: RunnerContext,
  instruction: MicroInstruction & { name: 'test' },
  pathInfos: PathInfo[]
): Promise<BasicInstructionResult> => {
  try {
    const started = new Date().getTime();
    await runTestInstruction(ctx, instruction, pathInfos);
    const finished = new Date().getTime();
    const delta_seconds = ((finished - started) / 1000).toFixed(1);
    ctx.termFormatter({
      title: 'Testing - finished',
      detail: `Took ${delta_seconds} seconds`,
      format: 'default',
      kind: 'info',
    });
  } catch (err) {
    ctx.errTermFormatter({
      title: 'Testing - build error',
      detail: err,
    });
    throw err;
  }
  return { status: 'ok' };
};

const runMarkdownInstruction = async (
  ctx: RunnerContext,
  instruction: MicroInstruction & { name: 'markdown' },
  pathInfos: PathInfo[]
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
    title: 'Markdown - final opts',
    detail: markdownOpts,
    kind: 'info',
    format: 'human',
  });

  const shouldFix = satisfyFlag('aim:fix', flags);
  if (shouldFix) {
    await runMdPrettier(pathPatterns);
  }
  const shouldCheck = satisfyFlag('aim:check', flags);
  if (shouldCheck) {
    await runMdRemark(markdownOpts, pathPatterns);
  }

  return { status: 'ok' };
};

export const runMarkdownInstructionWithCatch = async (
  ctx: RunnerContext,
  instruction: MicroInstruction & { name: 'markdown' },
  pathInfos: PathInfo[]
): Promise<BasicInstructionResult> => {
  try {
    const started = new Date().getTime();
    await runMarkdownInstruction(ctx, instruction, pathInfos);
    const finished = new Date().getTime();
    const delta_seconds = ((finished - started) / 1000).toFixed(1);
    ctx.termFormatter({
      title: 'Markdown - finished',
      detail: `Took ${delta_seconds} seconds`,
      format: 'default',
      kind: 'info',
    });
  } catch (err) {
    ctx.errTermFormatter({
      title: 'Markdown - markdown error',
      detail: err,
    });
    throw err;
  }
  return { status: 'ok' };
};

export const runInstructions = async (
  ctx: RunnerContext,
  instructions: MicroInstruction[]
): Promise<InstructionStatus> => {
  const filesInstruction = instructions.find((instr) => instr.name === 'files');
  const loadInstruction = instructions.find((instr) => instr.name === 'load');
  const globInstruction = instructions.find((instr) => instr.name === 'glob');
  const filterInstruction = instructions.find(
    (instr) => instr.name === 'filter'
  );
  const lintInstruction = instructions.find((instr) => instr.name === 'lint');
  const testInstruction = instructions.find((instr) => instr.name === 'test');
  const markdownInstruction = instructions.find(
    (instr) => instr.name === 'markdown'
  );

  const files =
    filesInstruction && filesInstruction.name === 'files'
      ? runFilesInstruction(ctx, filesInstruction)
      : [];
  const loaded =
    loadInstruction && loadInstruction.name === 'load'
      ? await runLoadInstruction(ctx, loadInstruction)
      : [];
  const globed =
    globInstruction && globInstruction.name === 'glob'
      ? await runGlobInstructionWithCatch(ctx, globInstruction)
      : [];

  const allFileInfos = [...files, ...loaded, ...globed];
  const filtered =
    filterInstruction && filterInstruction.name === 'filter'
      ? runFilterInstruction(ctx, filterInstruction, allFileInfos)
      : allFileInfos;
  const linted =
    lintInstruction && lintInstruction.name === 'lint'
      ? await runLintInstructionWithCatch(ctx, lintInstruction, filtered)
      : false;

  const tested =
    testInstruction && testInstruction.name === 'test'
      ? await runTestInstructionWithCatch(ctx, testInstruction, filtered)
      : false;

  const markdowned =
    markdownInstruction && markdownInstruction.name === 'markdown'
      ? await runMarkdownInstructionWithCatch(
          ctx,
          markdownInstruction,
          filtered
        )
      : false;

  return linted
    ? linted.status
    : tested
    ? tested.status
    : markdowned
    ? markdowned.status
    : 'ko';
};
