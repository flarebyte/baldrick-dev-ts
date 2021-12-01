import {
  LintInstructionResult,
  InstructionStatus,
  LintMode,
  LintResolvedOpts,
  MicroInstruction,
  PathInfo,
  RunnerContext,
  TermFormatterParams,
  TestResolvedOpts,
  TestMode,
  TestInstructionResult,
  BuildInstructionResult,
  BuildResolvedOpts,
  BuildMode,
  PresetRollupOptions,
  BasicInstructionResult,
} from './model.js';
import { asPath, toMergedPathInfos, toPathInfo } from './path-transforming.js';
import { readFile } from 'fs/promises';
import path from 'path';
import { byFileQuery, commanderStringsToFiltering } from './path-filtering.js';
import glob from 'tiny-glob';
import { createESLint, lintCommand } from './eslint-helper.js';
import { flagsToEcmaVersion } from './eslint-config.js';
import { outputFile } from 'fs-extra';
import { ESLint } from 'eslint';
import { createJest, jestCommand } from './jest-helper.js';
import { buildBundle, cleanDistFolder } from './rollup-helper.js';
import { esmRollupPreset } from './rollup-config-preset.js';

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
  instruction: MicroInstruction
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
  instruction: MicroInstruction
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
  instruction: MicroInstruction
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

export const runFilterInstruction = (
  ctx: RunnerContext,
  instruction: MicroInstruction,
  pathInfos: PathInfo[]
): PathInfo[] => {
  ctx.termFormatter(instructionToTermIntro(instruction));
  const {
    params: { query },
  } = instruction;
  const filtering = commanderStringsToFiltering(query || []);
  return pathInfos.filter(byFileQuery(filtering));
};

const knownLintFlags = ['lint:check', 'lint:fix', 'lint:ci'];

const toLintFlag = (flags: string[]): LintMode => {
  const lintFlag = flags.filter((flag) => knownLintFlags.includes(flag))[0];
  if (lintFlag === 'lint:fix') {
    return 'fix';
  }
  if (lintFlag === 'lint:ci') {
    return 'ci';
  }
  return 'check';
};

const knownTestFlags = ['test:check', 'test:fix', 'test:ci', 'test:cov'];

const toTestFlag = (flags: string[]): TestMode => {
  const testFlag = flags.filter((flag) => knownTestFlags.includes(flag))[0];
  if (testFlag === 'test:fix') {
    return 'fix';
  }
  if (testFlag === 'test:ci') {
    return 'ci';
  }

  if (testFlag === 'test:cov') {
    return 'cov';
  }
  return 'check';
};

const knownBuildFlags = ['build:check', 'build:prod'];

const toBuildFlag = (flags: string[]): BuildMode => {
  const buildFlag = flags.filter((flag) => knownBuildFlags.includes(flag))[0];
  if (buildFlag === 'build:prod') {
    return 'prod';
  }

  return 'check';
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
  instruction: MicroInstruction,
  pathInfos: PathInfo[]
): Promise<LintInstructionResult> => {
  ctx.termFormatter(instructionToTermIntro(instruction));
  const {
    params: { targetFiles, reportBase, flags },
  } = instruction;
  const isCI = (flags || []).includes('lint:ci');
  const shouldFix = (flags || []).includes('lint:fix');
  const targetFilesOrEmpty = targetFiles || [];
  const pathPatterns = [...targetFilesOrEmpty, ...pathInfos.map(asPath)];
  const lintOpts: LintResolvedOpts = {
    modulePath: ctx.currentPath,
    mode: toLintFlag(flags || []),
    pathPatterns,
    ecmaVersion: flagsToEcmaVersion(flags || []),
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
    const reportBasePrefix =
      (reportBase && reportBase[0]) || 'report/lint-report';
    await outputFile(`${reportBasePrefix}.json`, json, 'utf8');
    await outputFile(`${reportBasePrefix}.junit.xml`, junitXml, 'utf8');
  }
  const status = toEslintStatus(lintResults);
  return { text, json, junitXml, compact, status, lintResults };
};

export const runLintInstructionWithCatch = async (
  ctx: RunnerContext,
  instruction: MicroInstruction,
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
  instruction: MicroInstruction,
  pathInfos: PathInfo[]
): Promise<TestInstructionResult> => {
  ctx.termFormatter(instructionToTermIntro(instruction));
  const {
    params: { targetFiles, reportBase, displayName, flags },
  } = instruction;

  // const isCI = flags.includes('test:ci');
  const reportBasePrefix =
    (reportBase && reportBase[0]) || 'report/test-report';
  const outputDirectory = path.dirname(reportBasePrefix);
  const outputName = path.basename(reportBasePrefix);
  const targetFilesOrEmpty = targetFiles || [];
  const pathPatterns = [...targetFilesOrEmpty, ...pathInfos.map(asPath)];
  const testOpts: TestResolvedOpts = {
    modulePath: ctx.currentPath,
    mode: toTestFlag(flags || []),
    pathPatterns,
    outputDirectory,
    outputName,
    displayName: (displayName && displayName[0]) || '',
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
  instruction: MicroInstruction,
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

const runBuildInstruction = async (
  ctx: RunnerContext,
  instruction: MicroInstruction,
  pathInfos: PathInfo[]
): Promise<BuildInstructionResult> => {
  ctx.termFormatter(instructionToTermIntro(instruction));
  const {
    params: { targetFiles, reportBase, flags },
  } = instruction;
  const reportBasePrefix =
    (reportBase && reportBase[0]) || 'report/test-report';

  const outputDirectory = path.dirname(reportBasePrefix);
  const outputName = path.basename(reportBasePrefix);

  const targetFilesOrEmpty = targetFiles || [];
  const pathPatterns = [...targetFilesOrEmpty, ...pathInfos.map(asPath)];
  const buildOpts: BuildResolvedOpts = {
    modulePath: ctx.currentPath,
    mode: toBuildFlag(flags || []),
    pathPatterns,
    outputDirectory,
    outputName,
  };

  ctx.termFormatter({
    title: 'Building - final opts',
    detail: buildOpts,
    kind: 'info',
    format: 'human',
  });

  const presetOpts: PresetRollupOptions = {
    buildFolder: 'dist',
    name: 'demo-name',
    input: 'src/index.ts',
    strategy: 'production',
    format: 'esm',
  };
  const rollupConfig = esmRollupPreset(presetOpts);

  ctx.termFormatter({
    title: 'Building - rollup config',
    detail: rollupConfig,
    kind: 'info',
    format: 'default',
  });

  await cleanDistFolder(presetOpts.buildFolder);
  await buildBundle(rollupConfig);

  return { status: 'ok' };
};

export const runBuildInstructionWithCatch = async (
  ctx: RunnerContext,
  instruction: MicroInstruction,
  pathInfos: PathInfo[]
): Promise<BasicInstructionResult> => {
  try {
    const started = new Date().getTime();
    await runBuildInstruction(ctx, instruction, pathInfos);
    const finished = new Date().getTime();
    const delta_seconds = ((finished - started) / 1000).toFixed(1);
    ctx.termFormatter({
      title: 'Building - finished',
      detail: `Took ${delta_seconds} seconds`,
      format: 'default',
      kind: 'info',
    });
  } catch (err) {
    ctx.errTermFormatter({
      title: 'Building - build error',
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
  const buildInstruction = instructions.find((instr) => instr.name === 'build');

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
    ? await runLintInstructionWithCatch(ctx, lintInstruction, filtered)
    : false;

  const tested = testInstruction
    ? await runTestInstructionWithCatch(ctx, testInstruction, filtered)
    : false;

  const built = buildInstruction
    ? await runBuildInstructionWithCatch(ctx, buildInstruction, filtered)
    : false;

  return linted
    ? linted.status
    : tested
    ? tested.status
    : built
    ? built.status
    : 'ko';
};
