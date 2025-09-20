import { runReleaseActionWithCatch } from './action-release.js';
import { toMarkdownInstructions } from './instruction-building.js';
import { runInstructions } from './instruction-runner.js';
import {
  MarkdownAction,
  MarkdownActionOpts,
  LintAction,
  RunnerContext,
  TestAction,
  ReleaseAction,
  ReleaseActionOpts,
} from './model.js';

export const cmdLintAction: LintAction = async (ctx: RunnerContext) => {
  ctx.termFormatter({
    title: 'Lint - no longer supported',
    detail:
      'The lint command has been deprecated and is no longer supported in this project scope.',
    kind: 'info',
    format: 'default',
  });
};

export const cmdTestAction: TestAction = async (ctx: RunnerContext) => {
  ctx.termFormatter({
    title: 'Test - no longer supported',
    detail:
      'The test command has been deprecated and is no longer supported in this project scope.',
    kind: 'info',
    format: 'default',
  });
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
