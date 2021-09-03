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
import { createESLint, ESLintHandle, lintCommand } from '../src/eslint-command';
import { LintResolvedOpts } from '../src/model';
import { simpleToolOptions } from './fixture-tool-opts';
import fs from 'fs-extra';
import { diffChars } from 'diff';

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

const readTempFileAsync = (modulePath: string, filename: string): string => {
  return fs.readFileSync(`${modulePath}/${filename}`, 'utf8');
};

const toLastPartOfFile = (longPath: string): string =>
  longPath.split('/').reverse()[0];

describe('eslint-command', () => {
  const handleToBeDefined = (handle: ESLintHandle) => {
    expect(handle).toBeDefined();
    expect(handle.eslint).toBeDefined();
    expect(handle.opts).toBeDefined();
    expect(handle.options).toBeDefined();
    expect(handle.formatter).toBeDefined();
    expect(handle.jsonFormatter).toBeDefined();
  };
  it('run linting check', async () => {
    const modulePath = createProjectDir();
    const lintOpts: LintResolvedOpts = {
      modulePath,
      mode: 'check',
      folders: ['src', 'test'],
    };
    const handle = await createESLint(lintOpts);
    handleToBeDefined(handle);
    const results = await lintCommand(handle);
    expect(results).toHaveLength(3);
    expect(handle.formatter.format(results)).toContain('Missing return type');
    expect(handle.jsonFormatter.format(results)).toContain(
      'Missing return type'
    );
    expect(results.map((r) => r.errorCount)).toEqual([3, 5, 1]);
    expect(results.map((r) => r.warningCount)).toEqual([2, 1, 0]);
    expect(results.map((r) => toLastPartOfFile(r.filePath))).toEqual([
      'index.ts',
      'problematic.ts',
      'index.test.ts',
    ]);
    expect(results.map((r) => r.fixableErrorCount)).toEqual([3, 4, 1]);
    expect(results.map((r) => r.fixableWarningCount)).toEqual([0, 0, 0]);
  });

  it('run linting fix', async () => {
    const modulePath = createProjectDir();
    const lintOpts: LintResolvedOpts = {
      modulePath,
      mode: 'fix',
      folders: ['src', 'test'],
    };
    const handle = await createESLint(lintOpts);
    handleToBeDefined(handle);
    const indexBefore = readTempFileAsync(modulePath, 'src/index.ts');
    const results = await lintCommand(handle);
    expect(results).toHaveLength(3);
    expect(handle.formatter.format(results)).toContain('Missing return type');
    expect(handle.jsonFormatter.format(results)).toContain(
      'Missing return type'
    );
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
