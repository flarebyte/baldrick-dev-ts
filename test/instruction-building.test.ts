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
        name: 'configure-lint',
        params: {
          targetFiles: ['src', 'test'],
        },
      },
    ]
  ),
  createExample(
    [],
    { ...emptyFileFiltering, withPathStarting: ['test/'], withExtension: ['.specs.ts'] },
    [
      {
        name: 'configure-lint',
        params: {
          targetFiles: ['src', 'test'],
          extensions: ['.specs.ts']
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
