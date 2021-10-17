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
});
