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

export const createPackageJson = (
): FileContent => ({
  path: "package.json",
  content: JSON.stringify(
    {
      name: "test-package-name",
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

export const createTempDirsSync = () => {
  fs.emptyDirSync("temp");
  fs.mkdirSync("temp/src");
  fs.mkdirSync("temp/test");
};

export const createTestingFilesSync = (modulePath: string, fileContents: FileContent[]) => {
  fileContents.forEach((fileContent) =>
    fs.writeFileSync(`${modulePath}/${fileContent.path}`, fileContent.content)
  );
};
