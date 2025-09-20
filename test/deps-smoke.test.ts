import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

// commander
import { Command } from 'commander';

// execa
import { execa } from 'execa';

// fs-extra
import { ensureDir, outputFile, remove } from 'fs-extra';
import { readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

// prettier
import { format } from 'prettier';

// tiny-glob
import glob from 'tiny-glob';

// remark and plugins
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import { reporter } from 'vfile-reporter';
import { reporterJson } from 'vfile-reporter-json';

// tslib
import { __assign } from 'tslib';

describe('commander (smoke)', () => {
  test('parses an option', () => {
    const program = new Command();
    program
      .name('smoke')
      .option('-f, --flag <value>', 'a flag')
      .allowUnknownOption(true);
    program.parse(['node', 'smoke', '--flag', 'ok']);
    const opts = program.opts<{ flag: string }>();
    assert.equal(opts.flag, 'ok');
  });
});

describe('execa (smoke)', () => {
  test('executes node --version', async () => {
    const { stdout, exitCode } = await execa('node', ['--version']);
    assert.equal(exitCode, 0);
    assert.match(stdout, /^v\d+\./);
  });
});

describe('fs-extra (smoke)', () => {
  test('ensureDir, outputFile, readFile, remove', async () => {
    const base = path.join(os.tmpdir(), `deps-smoke-${process.pid}-${Date.now()}`);
    const filename = path.join(base, 'hello.txt');
    await ensureDir(base);
    await outputFile(filename, 'hello');
    const content = await readFile(filename, 'utf8');
    assert.equal(content, 'hello');
    await remove(base);
  });
});

describe('prettier (smoke)', () => {
  test('formats simple JS', () => {
    const code = 'const x=1\n';
    const formatted = format(code, { semi: true, singleQuote: true, parser: 'babel' });
    assert.ok(formatted.includes('const x = 1;'));
  });
});

describe('tiny-glob (smoke)', () => {
  test('globs TypeScript sources', async () => {
    const files = await glob('src/**/*.ts', { cwd: process.cwd(), filesOnly: true });
    assert.ok(files.length > 0);
  });
});

describe('remark + plugins (smoke)', () => {
  test('processes a markdown string and reports', async () => {
    const md = '# Title\n\n- a\n\n';
    const file = await remark()
      .use(remarkPresetLintConsistent)
      .use(remarkPresetLintRecommended)
      .use(remarkGfm)
      .process(md);
    file.basename = 'test.md';
    const textReport = reporter(file);
    const jsonReport = reporterJson(file);
    assert.equal(typeof textReport, 'string');
    assert.equal(typeof jsonReport, 'string');
  });
});

describe('tslib (smoke)', () => {
  test('__assign merges objects', () => {
    const result = __assign({ a: 1 }, { b: 2 });
    assert.deepEqual(result, { a: 1, b: 2 });
  });
});

