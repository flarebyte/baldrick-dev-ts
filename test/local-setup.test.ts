import {
  createTempDirsSync,
  createTestingFilesSync,
  createToolOptions,
} from "./generator";

describe("Local setup", () => {
  beforeAll(() => {
    createTempDirsSync();
    const fileContents = [
      createToolOptions({
        profileName: "ts-lib",
        sizeLimitKB: 10,
        coverage: {
          ignore: ["-io"],
          branches: 95,
          lines: 95,
          statements: 97,
          functions: 96,
        },
      }),
    ];
    createTestingFilesSync(fileContents);
  });

  it("reads the local setup", () => {});
});
