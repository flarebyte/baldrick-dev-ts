import {
  createPackageJson,
  createTempDirsSync,
  createTestingFilesSync,
  createToolOptions,
  editorConfig,
  indexTestTs,
  indexTs,
  loadSelection,
  prettierContent,
  problematicTs,
  readmeMd,
  tsconfigNode,
} from './generator';
import { simpleToolOptions } from './fixture-tool-opts';
import {
  runFilesInstruction,
  runFilterInstruction,
  runGlobInstruction,
  runLintInstruction,
  runLoadInstruction,
} from '../src/instruction-runner';
import { MicroInstruction } from '../src/model';

const someToolOptions = { ...simpleToolOptions };
const createProjectDir = () => {
  const tempDir = createTempDirsSync();
  const fileContents = [
    createToolOptions(someToolOptions),
    createPackageJson('module-' + tempDir.replace('/', '-')),
    indexTs,
    problematicTs,
    indexTestTs,
    readmeMd,
    editorConfig,
    prettierContent,
    loadSelection,
    tsconfigNode('node14'),
  ];
  createTestingFilesSync(tempDir, fileContents);
  return tempDir;
};

const toLastPartOfFile = (longPath: string): string =>
  longPath.split('/').reverse()[0];

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
        { currentPath: modulePath },
        instruction
      );
      expect(loaded).toHaveLength(2);
      expect(loaded[0].path).toBe('src/index.ts');
      expect(loaded[1].path).toBe('src/problematic.ts');
      expect(loaded[1].tags).toContain('buggy');
    });
  });
  describe('runFilesInstruction', () => {
    it('accept files directly', () => {
      const instruction: MicroInstruction = {
        name: 'files',
        params: { targetFiles: ['src/file1.ts', 'src/file2.ts;tag2'] },
      };
      const loaded = runFilesInstruction(
        { currentPath: 'path/not-used-here' },
        instruction
      );
      expect(loaded).toHaveLength(2);
      expect(loaded[0].path).toBe('src/file1.ts');
      expect(loaded[1].path).toBe('src/file2.ts');
      expect(loaded[1].tags).toContain('tag2');
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
        { currentPath: modulePath },
        instruction
      );
      expect(loaded).toHaveLength(3);
      expect(loaded[0].path).toBe('src/index.ts');
      expect(loaded[1].path).toBe('src/problematic.ts');
      expect(loaded[2].path).toBe('test/index.test.ts');
    });
  });
  describe('runFilterInstruction', () => {
    it('filter files using advanced filtering', () => {
      const instruction: MicroInstruction = {
        name: 'filter',
        params: { query: ['--with-path-starting', 'src/'] },
      };
      const loaded = runFilterInstruction(
        { currentPath: 'path/not-used-here' },
        instruction,
        [
          { path: 'src/this.ts', tags: [] },
          { path: 'other/that.ts', tags: [] },
        ]
      );
      expect(loaded).toHaveLength(1);
      expect(loaded[0].path).toBe('src/this.ts');
    });
  });
  describe('runLintInstruction', () => {
    const modulePath = createProjectDir();
    it('run lint check', async () => {
      const instruction: MicroInstruction = {
        name: 'lint',
        params: { targetFiles: ['src', 'test'], extensions: [] },
      };
      expect.assertions(7);
      const actual = await runLintInstruction(
        { currentPath: modulePath },
        instruction,
        [
          { path: 'src/this.ts', tags: [] },
          { path: 'other/that.ts', tags: [] },
        ]
      );
      expect(actual.text).toContain('Missing return type');
      expect(actual.text).toContain('Missing return type');
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
  });
});
