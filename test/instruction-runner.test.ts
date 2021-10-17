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
import { runLoadInstruction } from '../src/instruction-runner';
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
});