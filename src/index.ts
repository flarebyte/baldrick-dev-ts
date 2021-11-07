#!/usr/bin/env node

// import { Commanding } from './commanding';
import { cmdLintAction } from './commanding-action';
import { LintActionOpts, RunnerContext } from './model';
import { basicFormatter } from './term-formatter';

const ctx: RunnerContext = {
  currentPath: process.cwd(),
  termFormatter: basicFormatter,
};

const lintOpts: LintActionOpts = {
  flags: [`lint:check`, `ecma:2019`],
  fileSearching: {
    pathInfos: [],
    filtering: {
      withPathStarting: ['src'],
      withoutPathStarting: [],
      withExtension: [],
      withoutExtension: [],
      withPathSegment: [],
      withoutPathSegment: [],
      withTag: [],
      withoutTag: [],
      withTagStarting: [],
      withoutTagStarting: [],
    },
  },
  ecmaVersion: 2019,
  report: [],
};

await cmdLintAction(ctx, lintOpts);

// const commanding = new Commanding();
// commanding.declareLintAction(cmdLintAction);

// async function main() {
//   await commanding.parseAsync(process.argv);
// }
// try {
//   await main();
// } catch (err) {
//   console.error(err);
// }
