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
} from './model.js';

export const cmdLintAction: LintAction = async (
  ctx: RunnerContext,
  options: LintActionOpts
) => {
  const instructions = toLintInstructions(options);
  const status = await runInstructions(ctx, instructions);
  if (status === 'ko') {
    throw Error('Lint action did fail !');
  }
};

export const cmdTestAction: TestAction = async (
  ctx: RunnerContext,
  options: TestActionOpts
) => {
  const instructions = toTestInstructions(options);
  const status = await runInstructions(ctx, instructions);
  if (status === 'ko') {
    throw Error('Test action did fail !');
  }
};

export const cmdMarkdownAction: MarkdownAction = async (
  ctx: RunnerContext,
  options: MarkdownActionOpts
) => {
  const instructions = toMarkdownInstructions(options);
  const status = await runInstructions(ctx, instructions);
  if (status === 'ko') {
    throw Error('Markdown action did fail !');
  }
};
