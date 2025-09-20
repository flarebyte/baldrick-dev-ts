import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import type { FileFiltering, PathInfo } from '../src/model.js';
import {
  byFileQuery,
  commanderStringsToFiltering,
  emptyFileFiltering,
  filteringToCommanderStrings,
} from '../src/path-filtering.js';

const pi = (path: string, tags: string[] = []): PathInfo => ({ path, tags });

describe('byFileQuery - includes', () => {
  test('empty filter accepts any path', () => {
    const f: FileFiltering = { ...emptyFileFiltering };
    assert.equal(byFileQuery(f)(pi('any/file.ts')), true);
  });

  test('withPathStarting must match prefix', () => {
    const f: FileFiltering = { ...emptyFileFiltering, withPathStarting: ['src/'] };
    assert.equal(byFileQuery(f)(pi('src/utils/file.ts')), true);
    assert.equal(byFileQuery(f)(pi('test/utils/file.ts')), false);
  });

  test('withExtension must match file extension', () => {
    const f: FileFiltering = { ...emptyFileFiltering, withExtension: ['.ts'] };
    assert.equal(byFileQuery(f)(pi('src/app.ts')), true);
    assert.equal(byFileQuery(f)(pi('src/app.js')), false);
  });

  test('withPathSegment must be included in path', () => {
    const f: FileFiltering = { ...emptyFileFiltering, withPathSegment: ['utils'] };
    assert.equal(byFileQuery(f)(pi('src/utils/file.ts')), true);
    assert.equal(byFileQuery(f)(pi('src/core/file.ts')), false);
  });

  test('withTag and withTagStarting must match tags', () => {
    const f1: FileFiltering = { ...emptyFileFiltering, withTag: ['@load'] };
    assert.equal(byFileQuery(f1)(pi('src/a.ts', ['@load'])), true);
    assert.equal(byFileQuery(f1)(pi('src/a.ts', [])), false);

    const f2: FileFiltering = { ...emptyFileFiltering, withTagStarting: ['aim:'] };
    assert.equal(byFileQuery(f2)(pi('src/a.ts', ['aim:ci'])), true);
    assert.equal(byFileQuery(f2)(pi('src/a.ts', ['topic:ci'])), false);
  });
});

describe('byFileQuery - excludes', () => {
  test('withoutPathStarting excludes when prefix matches', () => {
    const f: FileFiltering = { ...emptyFileFiltering, withoutPathStarting: ['dist/'] };
    assert.equal(byFileQuery(f)(pi('src/app.ts')), true);
    assert.equal(byFileQuery(f)(pi('dist/app.ts')), false);
  });

  test('withoutExtension excludes matching extension', () => {
    const f: FileFiltering = { ...emptyFileFiltering, withoutExtension: ['.js'] };
    assert.equal(byFileQuery(f)(pi('src/app.ts')), true);
    assert.equal(byFileQuery(f)(pi('src/app.js')), false);
  });

  test('withoutPathSegment excludes when segment present', () => {
    const f: FileFiltering = { ...emptyFileFiltering, withoutPathSegment: ['node_modules'] };
    assert.equal(byFileQuery(f)(pi('src/app.ts')), true);
    assert.equal(byFileQuery(f)(pi('node_modules/pkg/file.ts')), false);
  });

  test('withoutTag and withoutTagStarting exclude matching tags', () => {
    const f1: FileFiltering = { ...emptyFileFiltering, withoutTag: ['deprecated'] };
    assert.equal(byFileQuery(f1)(pi('src/a.ts', [])), true);
    assert.equal(byFileQuery(f1)(pi('src/a.ts', ['deprecated'])), false);

    const f2: FileFiltering = { ...emptyFileFiltering, withoutTagStarting: ['ignore:'] };
    assert.equal(byFileQuery(f2)(pi('src/a.ts', ['topic:ci'])), true);
    assert.equal(byFileQuery(f2)(pi('src/a.ts', ['ignore:foo'])), false);
  });
});

describe('filtering <-> commander strings', () => {
  test('handles missing parameters gracefully', () => {
    const cmd: string[] = ['--with-path-starting', 'src/'];
    const parsed = commanderStringsToFiltering(cmd);
    const rt = commanderStringsToFiltering(filteringToCommanderStrings(parsed));
    assert.deepEqual(rt, {
      ...emptyFileFiltering,
      withPathStarting: ['src/'],
    });
  });
});

