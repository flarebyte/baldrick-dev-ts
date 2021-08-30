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

const someToolOptions = { ...simpleToolOptions };
const createProjectDir = () => {
  const tempDir = createTempDirsSync();
  const fileContents = [
    createToolOptions(someToolOptions),
    createPackageJson("module-" + tempDir.replace("/", "-")),
    indexTs,
    indexTestTs,
  ];
  createTestingFilesSync(tempDir, fileContents);
  return tempDir;
};
describe("eslint-command", () => {
  it("run linting", () => {
    const modulePath = createProjectDir();
    const lintOpts: LintOpts = {
      fix: false,
      writeFile: false,
      reportFile: "report",
      maxWarnings: 3,
    };
    const someLocalSetup: LocalSetup = {
      modulePath,
      toolOptions: someToolOptions,
    };
    const actual = eslintCommand(someLocalSetup)(lintOpts);
    expect(actual).toBeDefined();
  });
});
