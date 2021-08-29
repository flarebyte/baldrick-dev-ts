import {
  createPackageJson,
  createTempDirsSync,
  createTestingFilesSync,
  createToolOptions,
} from "./generator";
import { eslintCommand } from "../src/eslint-command";
import { LocalSetup } from "../src/model";
import { simpleToolOptions } from "./fixture-tool-opts";

const someToolOptions = {...simpleToolOptions}
const someLocalSetup: LocalSetup = {
    modulePath: 'temp',
    toolOptions: someToolOptions
}

describe("eslint-command", () => {
  beforeAll(() => {
    createTempDirsSync();
    const fileContents = [
      createToolOptions(someToolOptions),
      createPackageJson(),
    ];
    createTestingFilesSync("temp", fileContents);
  });
  it("run linting", () => {
    const actual = eslintCommand(someLocalSetup);
    expect(actual).toBeDefined()
  });
});
