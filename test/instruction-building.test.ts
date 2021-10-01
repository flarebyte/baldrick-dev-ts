import {
  FileFiltering,
  FileSearching,
  MicroInstruction,
  PathInfo,
} from '../src/model';
import { toLintInstructions } from '../src/instruction-building';
import { emptyFileFiltering } from '../src/path-filtering';

const createExample = (
  givenPathInfos: PathInfo[],
  givenFiltering: FileFiltering,
  expected: MicroInstruction[]
): [string, FileSearching, MicroInstruction[]] => {
  const given: FileSearching = {
    pathInfos: givenPathInfos,
    filtering: givenFiltering,
  };
  return [JSON.stringify(given), given, expected];
};

// https://eslint.org/docs/developer-guide/nodejs-api#-new-eslintoptions

const givenExamples: [string, FileSearching, MicroInstruction[]][] = [
  createExample(
    [],
    { ...emptyFileFiltering, withPathStarting: ['src/', 'test/'] },
    [
      {
        name: 'lint',
        params: {
          targetFiles: ['src/', 'test/'],
          extensions: [],
          flags: [],
        },
      },
    ]
  ),
  createExample(
    [],
    {
      ...emptyFileFiltering,
      withPathStarting: ['test/'],
      withExtension: ['.specs.ts'],
    },
    [
      {
        name: 'lint',
        params: {
          targetFiles: ['test/'],
          extensions: ['.specs.ts'],
          flags: [],
        },
      },
    ]
  ),
  createExample(
    [
      { path: 'gen/step1.ts', tags: ['phase1'] },
      { path: 'gen/step2.ts', tags: ['phase2'] },
    ],
    { ...emptyFileFiltering, withTag: ['phase1'] },
    [
      {
        name: 'files',
        params: {
          targetFiles: ['gen/step1.ts'],
        },
      },
      {
        name: 'lint',
        params: {
          targetFiles: [],
          extensions: [],
          flags: ['globInputPaths:false'],
        },
      },
    ]
  ),
  createExample(
    [{ path: 'gen/schemas.csv', tags: ['@load'] }],
    { ...emptyFileFiltering, withTag: ['phase1'] },
    [
      {
        name: 'load',
        params: {
          targetFiles: ['gen/schemas.csv'],
        },
      },
      {
        name: 'filter',
        params: {
          query: ['--with-tag', 'phase1'],
        },
      },
      {
        name: 'lint',
        params: {
          targetFiles: [],
          extensions: [],
          flags: ['globInputPaths:false'],
        },
      },
    ]
  ),
  createExample(
    [],
    {
      ...emptyFileFiltering,
      withPathStarting: ['src/', 'test/'],
      withoutPathSegment: ['fixture'],
    },
    [
      {
        name: 'glob',
        params: {
          targetFiles: ['src/**/*', 'test/**/*'],
        },
      },
      {
        name: 'filter',
        params: {
          query: [
            '--with-path-starting',
            'src/',
            'test/',
            '--without-path-segment',
            'fixture',
          ],
        },
      },
      {
        name: 'lint',
        params: {
          targetFiles: [],
          extensions: [],
          flags: ['globInputPaths:false'],
        },
      },
    ]
  ),
];

describe('Build instruction for linting', () => {
  test.each(givenExamples)(
    'should provide instruction for %s',
    (label, given, expected) => {
      expect(label).toBeDefined();
      const actual = toLintInstructions(given);
      expect(actual).toEqual(expected);
    }
  );
});
