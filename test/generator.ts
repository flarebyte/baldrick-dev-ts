import fs from "fs-extra";
import { ToolOptions } from "../src/model";

interface FileContent {
  path: string;
  content: string;
}
export const createFileContent = (path: string, content: string) => ({
  path,
  content,
});

export const createPackageJson = ( name: string
): FileContent => ({
  path: "package.json",
  content: JSON.stringify(
    {
      name,
      dependencies: {},
      devDependencies: { jest: "^27.0.6" },
      engines: {
        node: ">=14",
      },
    },
    null,
    2
  ),
});

export const createToolOptions = (toolOpts: ToolOptions): FileContent => ({
  path: ".baldrick-dev.json",
  content: JSON.stringify(toolOpts, null, 2),
});

const randomBetween = (low: number, high: number): number => Math.ceil(Math.random() * (high - low) + low)

export const createTempDirsSync = () : string => {
  const suffix = randomBetween(1, 1000000)
  const tempFolder = `temp/temp${suffix}`
  fs.ensureDirSync(`${tempFolder}/src`);
  fs.ensureDirSync(`${tempFolder}/test`);
  return tempFolder;
};

export const emptyTempDir = () => fs.emptyDirSync('temp');

export const createTestingFilesSync = (modulePath: string, fileContents: FileContent[]) => {
  fileContents.forEach((fileContent) =>
    fs.writeFileSync(`${modulePath}/${fileContent.path}`, fileContent.content)
  );
};

const additionTs = `
export const sum = (a: number, b: number) => {
  return a + b;
};
`

export const indexTs: FileContent = createFileContent('src/index.ts', additionTs)

const additionTestTs = `
import { sum } from '../src';

describe('sum', () => {
  it('adds two numbers together', () => {
    expect(sum(1, 1)).toEqual(2);
  });
});
`

export const indexTestTs: FileContent = createFileContent('test/index.test.ts', additionTestTs)
