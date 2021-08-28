import fs from 'fs-extra'
import { ObjectWithKeys } from "../src/model";

interface FileContent {
  path: string;
  content: string;
}
export const createFileContent = (path: string, content: string) => ({ path, content})

export const createPackageJson = (
  jest?: ObjectWithKeys,
  eslint?: ObjectWithKeys,
  prettier?: ObjectWithKeys
): FileContent => ({
  path: "",
  content: JSON.stringify(
    {
      name: "test-package-name",
      jest,
      eslint,
      prettier,
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

export const createTempDirsSync = () => {
    fs.emptyDirSync('temp')
    fs.mkdirSync('temp/src')
    fs.mkdirSync('temp/test')
}

export const createTestingFilesSync = (fileContents: FileContent[]) => {
    fileContents.forEach( fileContent => fs.writeFileSync(fileContent.path, fileContent.content))
}