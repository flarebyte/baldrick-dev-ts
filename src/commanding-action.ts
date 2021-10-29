import { toLintInstructions } from './instruction-building';
import { runInstructions } from './instruction-runner';
import { LintAction, LintActionOpts, RunnerContext } from './model';

export const cmdLintAction: LintAction = async (
  ctx: RunnerContext,
  options: LintActionOpts
) => {
  const instructions = toLintInstructions(options);
  await runInstructions(ctx, instructions);
};
