import { toLintInstructions, toTestInstructions } from './instruction-building';
import { runInstructions } from './instruction-runner';
import { LintAction, LintActionOpts, RunnerContext, TestAction, TestActionOpts } from './model';

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
