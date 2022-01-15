import { runReleaseActionWithCatch } from './action-release.js';
import {
  toMarkdownInstructions,
  toLintInstructions,
  toTestInstructions,
} from './instruction-building.js';
import { runInstructions } from './instruction-runner.js';
import {
  MarkdownAction,
  MarkdownActionOpts,
  LintAction,
  LintActionOpts,
  RunnerContext,
  TestAction,
  TestActionOpts,
  ReleaseAction,
  ReleaseActionOpts,
} from './model.js';

export const cmdLintAction: LintAction = async (
  ctx: RunnerContext,
  options: LintActionOpts
) => {
  const instructions = toLintInstructions(options);
  const status = await runInstructions(ctx, instructions);
  if (status === 'ko') {
    throw new Error('Lint action did fail !');
  }
};

export const cmdTestAction: TestAction = async (
  ctx: RunnerContext,
  options: TestActionOpts
) => {
  const instructions = toTestInstructions(options);
  const status = await runInstructions(ctx, instructions);
  if (status === 'ko') {
    throw new Error('Test action did fail !');
  }
};

export const cmdMarkdownAction: MarkdownAction = async (
  ctx: RunnerContext,
  options: MarkdownActionOpts
) => {
  const instructions = toMarkdownInstructions(options);
  const status = await runInstructions(ctx, instructions);
  if (status === 'ko') {
    throw new Error('Markdown action did fail !');
  }
};

export const cmdReleaseAction: ReleaseAction = async (
  ctx: RunnerContext,
  options: ReleaseActionOpts
) => {
  const status = await runReleaseActionWithCatch(ctx, options);
  if (status === 'ko') {
    throw new Error('Release action did fail !');
  }
};
