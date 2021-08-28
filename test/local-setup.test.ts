import {
  createFileContent,
  createTempDirsSync,
  createTestingFilesSync,
} from "./generator";

const objSetup = (name: string) => ({
  name,
});

const stringObjSetup = (name: string) =>
  JSON.stringify(objSetup(name), null, 2);

describe("Local setup", () => {
  beforeAll(() => {
    createTempDirsSync();
    const fileContents = [
      createFileContent("eslintrc.json", stringObjSetup("eslint")),
      createFileContent("prettierrc.json", stringObjSetup("prettier")),
    ];
    createTestingFilesSync(fileContents);
  });

  it("reads the local setup", () => {});
});
