import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { wrapWord, normalizeMdLine } from '../src/text-helper.js';
import {
  filteringToCommanderStrings,
  commanderStringsToFiltering,
} from '../src/path-filtering.js';
import { emptyFileFiltering } from '../src/path-filtering.js';

describe('wrapWord', () => {
  test('wraps text to given width', () => {
    const text = 'lorem ipsum dolor sit amet';
    const wrapped = wrapWord(10, text);
    const lines = wrapped.split('\n');
    // every line should be <= 10 chars
    assert.ok(lines.every((l) => l.length <= 10));
    assert.equal(lines.join(' '), text);
  });
});

describe('normalizeMdLine', () => {
  test('keeps headers as-is', () => {
    const line = '# Title';
    assert.equal(normalizeMdLine(line), line);
  });

  test('wraps unordered list while preserving bullet', () => {
    const line = '- This is a short list item that should wrap on multiple lines when normalized';
    const normalized = normalizeMdLine(line);
    const lines = normalized.split('\n');
    assert.ok(lines.length > 1);
    assert.ok((lines[0] ?? '').startsWith('- '));
  });

  test('wraps blockquote while preserving > prefix on each line', () => {
    const line = '> This is a quoted text that should wrap on multiple lines when normalized to the preferred width.';
    const normalized = normalizeMdLine(line);
    const lines = normalized.split('\n');
    assert.ok(lines.length > 1);
    assert.ok(lines.every((l) => l.startsWith('> ')));
  });
});

describe('filtering round-trip', () => {
  test('commander strings -> filtering -> strings is stable', () => {
    const original = {
      ...emptyFileFiltering,
      withPathStarting: ['src/'],
      withExtension: ['.ts'],
      withPathSegment: ['helper'],
      withTag: ['@load'],
      withTagStarting: ['aim:'],
      withoutPathStarting: ['dist/'],
      withoutExtension: ['.js'],
      withoutPathSegment: ['node_modules'],
      withoutTag: ['ignore'],
      withoutTagStarting: ['deprecated:'],
    };
    const cmd = filteringToCommanderStrings(original);
    const parsed = commanderStringsToFiltering(cmd);
    assert.deepEqual(parsed, original);
  });
});
