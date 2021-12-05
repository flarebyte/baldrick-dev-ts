import {
  createPackageJson,
  createTempDirsSync,
  createTestingFilesSync,
  editorConfig,
  indexTestTs,
  indexTs,
  loadSelection,
  prettierContent,
  problematicTs,
  readmeMd,
  tsconfigNode,
} from './generator';
import {
  runFilesInstruction,
  runFilterInstruction,
  runGlobInstruction,
  runLintInstruction,
  runLoadInstruction,
} from '../src/instruction-runner';
import { MicroInstruction } from '../src/model';
import { basicFormatter, errorFormatter } from '../src/term-formatter';

import fs from 'fs-extra';
import { diffChars } from 'diff';

const termFormatter = basicFormatter;
const errTermFormatter = errorFormatter;

const createProjectDir = () => {
  const tempDir = createTempDirsSync();
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
  describe('runLoadInstruction', () => {
    const modulePath = createProjectDir();
    it('load one file', async () => {
      const instruction: MicroInstruction = {
        name: 'load',
        params: { targetFiles: ['load.txt'] },
      };
      expect.assertions(4);
      const loaded = await runLoadInstruction(
        { currentPath: modulePath, termFormatter, errTermFormatter },
        instruction
      );
      expect(loaded).toHaveLength(2);
      expect(loaded[0]?.path).toBe('src/index.ts');
      expect(loaded[1]?.path).toBe('src/problematic.ts');
      expect(loaded[1]?.tags).toContain('buggy');
    });
  });
  describe('runFilesInstruction', () => {
    it('accept files directly', () => {
      const instruction: MicroInstruction = {
        name: 'files',
        params: { targetFiles: ['src/file1.ts', 'src/file2.ts;tag2'] },
      };
      const loaded = runFilesInstruction(
        { currentPath: 'path/not-used-here', termFormatter, errTermFormatter },
        instruction
      );
      expect(loaded).toHaveLength(2);
      expect(loaded[0]?.path).toBe('src/file1.ts');
      expect(loaded[1]?.path).toBe('src/file2.ts');
      expect(loaded[1]?.tags).toContain('tag2');
    });
  });
  describe('runGlobInstruction', () => {
    const modulePath = createProjectDir();
    it('run glob', async () => {
      const instruction: MicroInstruction = {
        name: 'glob',
        params: { targetFiles: ['src/**/*', 'test/**/*'] },
      };
      expect.assertions(4);
      const loaded = await runGlobInstruction(
        { currentPath: modulePath, termFormatter, errTermFormatter },
        instruction
      );
      expect(loaded).toHaveLength(3);
      expect(loaded[0]?.path).toBe('src/index.ts');
      expect(loaded[1]?.path).toBe('src/problematic.ts');
      expect(loaded[2]?.path).toBe('test/index.test.ts');
    });
  });
  describe('runFilterInstruction', () => {
    it('filter files using advanced filtering', () => {
      const instruction: MicroInstruction = {
        name: 'filter',
        params: { query: ['--with-path-starting', 'src/'] },
      };
      const loaded = runFilterInstruction(
        { currentPath: 'path/not-used-here', termFormatter, errTermFormatter },
        instruction,
        [
          { path: 'src/this.ts', tags: [] },
          { path: 'other/that.ts', tags: [] },
        ]
      );
      expect(loaded).toHaveLength(1);
      expect(loaded[0]?.path).toBe('src/this.ts');
    });
  });
  describe('runLintInstruction', () => {
    const modulePath = createProjectDir();
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
