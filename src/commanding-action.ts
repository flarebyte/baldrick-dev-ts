import { toBuildInstructions, toLintInstructions, toTestInstructions } from './instruction-building';
import { runInstructions } from './instruction-runner';
import { BuildAction, BuildActionOpts, LintAction, LintActionOpts, RunnerContext, TestAction, TestActionOpts } from './model';

export const cmdLintAction: LintAction = async (
  ctx: RunnerContext,
  options: LintActionOpts
) => {
  const instructions = toLintInstructions(options);
  const status = await runInstructions(ctx, instructions);
  if (status === 'ko') {
    throw Error('Lint action did fail !')
  }
};

export const cmdTestAction: TestAction = async (
  ctx: RunnerContext,
  options: TestActionOpts
) => {
  const instructions = toTestInstructions(options);
  const status = await runInstructions(ctx, instructions);
  if (status === 'ko') {
    throw Error('Test action did fail !')
  }
};

export const cmdBuildAction: BuildAction = async (
  ctx: RunnerContext,
  options: BuildActionOpts
) => {
  const instructions = toBuildInstructions(options);
  const status = await runInstructions(ctx, instructions);
  if (status === 'ko') {
    throw Error('Build action did fail !')
  }
};
