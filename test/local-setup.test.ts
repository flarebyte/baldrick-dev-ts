import {
  createTempDirsSync,
  createTestingFilesSync,
  createToolOptions,
} from "./generator";
import { readLocalSetup } from "../src/local-setup";

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

  it("reads the local setup", () => {
    const actual = readLocalSetup("temp");
    expect(actual).toMatchInlineSnapshot(
      `
      Object {
        "appPath": "temp",
        "packageJson": Object {
          "name": "",
        },
        "toolOptions": Object {
          "coverage": Object {
            "branches": 100,
            "functions": 100,
            "ignore": Array [],
            "lines": 100,
            "statements": 100,
          },
          "profileName": "ts-lib",
          "sizeLimitKB": 5,
        },
      }
    `
    );
  });
});
