import {
  createPackageJson,
  createTempDirsSync,
  createTestingFilesSync,
  createToolOptions,
  indexTestTs,
  indexTs,
  problematicTs,
  readmeMd,
} from "./generator";
import { createESLint, ESLintHandle, lintCommand } from "../src/eslint-command";
import { LintResolvedOpts } from "../src/model";
import { simpleToolOptions } from "./fixture-tool-opts";

const someToolOptions = { ...simpleToolOptions };
const createProjectDir = () => {
  const tempDir = createTempDirsSync();
  const fileContents = [
    createToolOptions(someToolOptions),
    createPackageJson("module-" + tempDir.replace("/", "-")),
    indexTs,
    problematicTs,
    indexTestTs,
    readmeMd,
  ];
  createTestingFilesSync(tempDir, fileContents);
  return tempDir;
};
const toLastPartOfFile = (longPath: string): string =>
  longPath.split("/").reverse()[0];

describe("eslint-command", () => {
  const handleToBeDefined = (handle: ESLintHandle) => {
    expect(handle).toBeDefined();
    expect(handle.eslint).toBeDefined();
    expect(handle.opts).toBeDefined();
    expect(handle.options).toBeDefined();
    expect(handle.formatter).toBeDefined();
    expect(handle.jsonFormatter).toBeDefined();
  };
  it("run linting check", async () => {
    const modulePath = createProjectDir();
    const lintOpts: LintResolvedOpts = {
      modulePath,
      mode: "check",
      folders: ["src", "test"],
    };
    const handle = await createESLint(lintOpts);
    handleToBeDefined(handle);
    const results = await lintCommand(handle);
    expect(results).toHaveLength(3);
    expect(handle.formatter.format(results)).toContain("Missing return type");
    expect(handle.jsonFormatter.format(results)).toContain(
      "Missing return type"
    );
    expect(results.map((r) => r.errorCount)).toEqual([0, 1, 0]);
    expect(results.map((r) => r.warningCount)).toEqual([2, 1, 0]);
    expect(results.map((r) => toLastPartOfFile(r.filePath))).toEqual([
      "index.ts",
      "problematic.ts",
      "index.test.ts",
    ]);
    expect(results.map((r) => r.fixableErrorCount)).toEqual([0, 0, 0]);
    expect(results.map((r) => r.fixableWarningCount)).toEqual([0, 0, 0]);
  });
  it("run linting ci", async () => {
    const modulePath = createProjectDir();
    const lintOpts: LintResolvedOpts = {
      modulePath,
      mode: "ci",
      folders: ["src", "test"],
    };
    const handle = await createESLint(lintOpts);
    handleToBeDefined(handle);
    const results = await lintCommand(handle);
    expect(results).toHaveLength(3);
    expect(handle.formatter.format(results)).toContain("Missing return type");
    expect(handle.jsonFormatter.format(results)).toContain(
      "Missing return type"
    );
  });
  it("run linting fix", async () => {
    const modulePath = createProjectDir();
    const lintOpts: LintResolvedOpts = {
      modulePath,
      mode: "fix",
      folders: ["src", "test"],
    };
    const handle = await createESLint(lintOpts);
    handleToBeDefined(handle);
    const results = await lintCommand(handle);
    expect(results).toHaveLength(3);
    expect(handle.formatter.format(results)).toContain("Missing return type");
    expect(handle.jsonFormatter.format(results)).toContain(
      "Missing return type"
    );
  });
});
