import { FileFiltering, PathInfo } from '../src/model.js';
import {
  byFileQuery,
  commanderStringsToFiltering,
  emptyFileFiltering,
  filteringToCommanderStrings,
} from '../src/path-filtering.js';
import { asPath } from '../src/path-transforming.js';

const examples: PathInfo[] = [
  {
    path: 'package.json',
    tags: ['json'],
  },
  {
    path: 'README.md',
    tags: ['md'],
  },
  {
    path: 'src/index.ts',
    tags: ['ts'],
  },
  {
    path: 'src/data.json',
    tags: ['json'],
  },
  {
    path: 'src/alpha.ts',
    tags: ['ts'],
  },
  {
    path: 'src/bravo.ts',
    tags: ['ts'],
  },
  {
    path: 'src/charlie.ts',
    tags: ['ts', 'charlie'],
  },
  {
    path: 'test/index.test.ts',
    tags: ['ts'],
  },
  {
    path: 'test/alpha.test.ts',
    tags: ['ts'],
  },
  {
    path: 'test/bravo.test.ts',
    tags: ['ts'],
  },
  {
    path: 'test/charlie.test.ts',
    tags: ['ts', 'charlie'],
  },
];

const createExample = (
  given: FileFiltering,
  expectedPaths: string[]
): [string, FileFiltering, string[]] => [
  filteringToCommanderStrings(given).join(' '),
  given,
  expectedPaths,
];

const givenExamples: [string, FileFiltering, string[]][] = [
  createExample({ ...emptyFileFiltering }, examples.map(asPath)),
  createExample({ ...emptyFileFiltering, withPathStarting: ['src/'] }, [
    'src/index.ts',
    'src/data.json',
    'src/alpha.ts',
    'src/bravo.ts',
    'src/charlie.ts',
  ]),
  createExample({ ...emptyFileFiltering, withExtension: ['.json'] }, [
    'package.json',
    'src/data.json',
  ]),
  createExample({ ...emptyFileFiltering, withPathSegment: ['data'] }, [
    'src/data.json',
  ]),
  createExample({ ...emptyFileFiltering, withTag: ['json'] }, [
    'package.json',
    'src/data.json',
  ]),
  createExample({ ...emptyFileFiltering, withTagStarting: ['jso'] }, [
    'package.json',
    'src/data.json',
  ]),
  createExample({ ...emptyFileFiltering, withoutPathStarting: ['src/'] }, [
    'package.json',
    'README.md',
    'test/index.test.ts',
    'test/alpha.test.ts',
    'test/bravo.test.ts',
    'test/charlie.test.ts',
  ]),
  createExample(
    { ...emptyFileFiltering, withoutPathStarting: ['src/', 'test/'] },
    ['package.json', 'README.md']
  ),
  createExample(
    {
      ...emptyFileFiltering,
      withPathStarting: ['src/'],
      withExtension: ['.json', '.md'],
    },
    ['src/data.json']
  ),
  createExample(
    {
      ...emptyFileFiltering,
      withoutPathStarting: ['src/'],
      withExtension: ['.json', '.md'],
    },
    ['package.json', 'README.md']
  ),
  createExample(
    {
      ...emptyFileFiltering,
      withoutPathStarting: ['src/'],
      withoutExtension: ['.ts'],
    },
    ['package.json', 'README.md']
  ),
  createExample(
    {
      ...emptyFileFiltering,
      withPathStarting: ['test/'],
      withoutPathSegment: ['bravo', 'charlie'],
    },
    ['test/index.test.ts', 'test/alpha.test.ts']
  ),
  createExample(
    {
      ...emptyFileFiltering,
      withoutTag: ['ts', 'md'],
    },
    ['package.json', 'src/data.json']
  ),
  createExample(
    {
      ...emptyFileFiltering,
      withoutTagStarting: ['t', 'm'],
    },
    ['package.json', 'src/data.json']
  ),
];

describe('Path filtering', () => {
  test.each(givenExamples)(
    'should filter by given query %s',
    (label, given, expectedPaths) => {
      expect(label).toBeDefined();
      const actual = examples.filter(byFileQuery(given));
      expect(actual.map(asPath)).toEqual(expectedPaths);
    }
  );
});

const convExamples: [string, string[]][] = [
  ['with-path-starting', ['--with-path-starting', 'src1', 'src2']],
  ['without-path-starting', ['--without-path-starting', 'src1']],
  [
    'with-extension',
    ['--with-path-starting', 'src1', 'src2', '--with-extension', '.ts'],
  ],
  [
    'with-path-segment',
    [
      '--with-path-starting',
      'src1',
      '--with-path-segment',
      'fixture/',
      'data/',
    ],
  ],
  ['with-tag', ['--with-path-starting', 'src1', '--with-tag', 'one']],
  [
    'with-tag-starting',
    ['--with-path-starting', 'src1', '--with-tag-starting', 'year:'],
  ],
  [
    'without-extension',
    ['--with-path-starting', 'src1', '--without-extension', '.txt', '.md'],
  ],
  [
    'without-path-segment',
    ['--with-path-starting', 'src1', '--without-path-segment', 'fixture/'],
  ],
  [
    'without-tag',
    ['--with-path-starting', 'src1', '--without-tag', 'one', 'two'],
  ],
  [
    'without-tag-starting',
    [
      '--with-path-starting',
      'src1',
      '--without-tag-starting',
      'year:',
      'month:',
    ],
  ],
];

describe('filtering To commander strings and back', () => {
  test.each(convExamples)(
    'should convert back and forth %s',
    (label, convExample) => {
      expect(label).toBeDefined();
      const filterObj = commanderStringsToFiltering(convExample);
      const cmdStrings = filteringToCommanderStrings(filterObj);
      expect(cmdStrings).toStrictEqual(convExample);
    }
  );
  it('should tolerate missing parameters', () => {
    const actual = commanderStringsToFiltering([
      '--with-path-starting',
      'src1',
      '--without-tag',
    ]);
    expect(actual.withPathStarting).toStrictEqual(['src1']);
    expect(actual.withoutTag).toStrictEqual([]);
  });
});
