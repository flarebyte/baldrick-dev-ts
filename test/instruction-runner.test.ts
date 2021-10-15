import {
  createPackageJson,
  createTempDirsSync,
  createTestingFilesSync,
  createToolOptions,
  editorConfig,
  indexTestTs,
  indexTs,
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
    tsconfigNode('node14'),
  ];
  createTestingFilesSync(tempDir, fileContents);
  return tempDir;
};

describe('Run instructions', () => {
  describe('runLoadInstruction', () => {
    const modulePath = createProjectDir();
    it('run linting check', async () => {
      const instruction: MicroInstruction = {
        name: 'load',
        params: { targetFiles: [
          'load.txt'
        ] },
      }
      runLoadInstruction({ currentPath: modulePath}, instruction);
    });
  });
});
