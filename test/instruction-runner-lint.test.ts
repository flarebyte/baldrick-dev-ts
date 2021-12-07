import {
  createPackageJson,
  createTempDirsSync,
  createTestingFilesSync,
  editorConfig,
  emptyTempDir,
  indexTestTs,
  indexTs,
  loadSelection,
  prettierContent,
  problematicTs,
  readmeMd,
  tsconfigNode,
} from './generator';
import { runLintInstruction } from '../src/instruction-runner';
import { MicroInstruction } from '../src/model';

import fs from 'fs-extra';
import { diffChars } from 'diff';

const termFormatter = jest.fn();
const errTermFormatter = jest.fn();

const testFolder = 'lint';

const createProjectDir = () => {
  const tempDir = createTempDirsSync(testFolder);
  const fileContents = [
    createPackageJson('module-' + tempDir.replace('/', '-')),
    indexTs,
    problematicTs,
    indexTestTs,
    readmeMd,
    editorConfig,
    prettierContent,
    loadSelection,
    tsconfigNode('es2020'),
  ];
  createTestingFilesSync(tempDir, fileContents);
  return tempDir;
};

const readTempFileAsync = (modulePath: string, filename: string): string => {
  return fs.readFileSync(`${modulePath}/${filename}`, 'utf8');
};
const toLastPartOfFile = (longPath: string): string =>
  longPath.split('/').reverse()[0] || '';

describe('Run instructions', () => {
  let modulePath: string;

  afterAll(() => {
    emptyTempDir(testFolder);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    emptyTempDir(testFolder);
    modulePath = createProjectDir();
  });
  describe('runLintInstruction', () => {
    it('run lint check', async () => {
      const instruction: MicroInstruction = {
        name: 'lint',
        params: {
          extensions: [],
          flags: [],
          targetFiles: [],
          reportBase: 'report/base',
          reportDirectory: 'report',
          reportPrefix: 'base',
          ecmaVersion: 2020,
        },
      };
      expect.assertions(7);
      const actual = await runLintInstruction(
        { currentPath: modulePath, termFormatter, errTermFormatter },
        instruction,
        [
          { path: 'src', tags: [] },
          { path: 'test', tags: [] },
        ]
      );
      expect(actual.text).toContain('Missing return type');
      expect(actual.json).toContain('Missing return type');
      expect(actual.lintResults.map((r) => r.errorCount)).toEqual([3, 5, 1]);
      expect(actual.lintResults.map((r) => r.warningCount)).toEqual([2, 1, 0]);
      expect(
        actual.lintResults.map((r) => toLastPartOfFile(r.filePath))
      ).toEqual(['index.ts', 'problematic.ts', 'index.test.ts']);
      expect(actual.lintResults.map((r) => r.fixableErrorCount)).toEqual([
        3, 4, 1,
      ]);
      expect(actual.lintResults.map((r) => r.fixableWarningCount)).toEqual([
        0, 0, 0,
      ]);
    });
    it('run lint fix', async () => {
      const indexBefore = readTempFileAsync(modulePath, 'src/index.ts');
      const instruction: MicroInstruction = {
        name: 'lint',
        params: {
          extensions: [],
          flags: ['aim:fix'],
          targetFiles: [],
          reportBase: 'report/base',
          reportDirectory: 'report',
          reportPrefix: 'base',
          ecmaVersion: 2020,
        },
      };
      expect.assertions(3);
      const actual = await runLintInstruction(
        { currentPath: modulePath, termFormatter, errTermFormatter },
        instruction,
        [
          { path: 'src', tags: [] },
          { path: 'test', tags: [] },
        ]
      );
      expect(actual.text).toContain('Missing return type');
      expect(actual.json).toContain('Missing return type');
      const indexAfter = readTempFileAsync(modulePath, 'src/index.ts');
      const diffIndex = diffChars(indexBefore, indexAfter);
      expect(diffIndex).toMatchInlineSnapshot(`
        Array [
          Object {
            "count": 143,
            "value": "
        export const sum = (a: number, b: number) => {
          return a + b;
        };


        export const addPrefix = (text: string) => {
          return \\"prefix\\" + text;
        };
        ",
          },
        ]
      `);
    });
  });
});
