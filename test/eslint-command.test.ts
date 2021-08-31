import {
  createPackageJson,
  createTempDirsSync,
  createTestingFilesSync,
  createToolOptions,
  indexTestTs,
  indexTs,
  problematicTs,
} from "./generator";
import { createESLint, lintCommand } from "../src/eslint-command";
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
  ];
  createTestingFilesSync(tempDir, fileContents);
  return tempDir;
};
describe("eslint-command", () => {
  it("run linting", async () => {
    const modulePath = createProjectDir();
    const lintOpts: LintResolvedOpts = {
      modulePath,
      mode: 'check',
      folders: ['src', 'test']
    };
    const handle = await createESLint(lintOpts);
    expect(handle).toBeDefined();
    expect(handle.eslint).toBeDefined();
    expect(handle.opts).toBeDefined();
    expect(handle.options).toBeDefined();
    expect(handle.formatter).toBeDefined();
    const results = await lintCommand(handle)
    expect(results).toHaveLength(3)
    expect(handle.formatter.format(results)).toContain('Missing return type')
  });
});
