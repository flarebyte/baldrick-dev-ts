import {
  createPackageJson,
  createTempDirsSync,
  createTestingFilesSync,
  createToolOptions,
  indexTestTs,
  indexTs,
} from "./generator";
import { eslintCommand } from "../src/eslint-command";
import { LintOpts, LocalSetup } from "../src/model";
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
      indexTs,
      indexTestTs
    ];
    createTestingFilesSync("temp", fileContents);
  });
  it("run linting", () => {
      const lintOpts: LintOpts = {
        fix: false,
        writeFile: false,
        reportFile: "report",
        maxWarnings: 3
      }
    const actual = eslintCommand(someLocalSetup)(lintOpts);
    expect(actual).toBeDefined()
  });
});
