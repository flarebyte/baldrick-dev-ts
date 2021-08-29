import {
  createPackageJson,
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
        linting: {
          ignore: ["-io"],
        },
      }),
      createPackageJson(),
    ];
    createTestingFilesSync("temp", fileContents);
  });

  it("reads the local setup", () => {
    const actual = readLocalSetup("temp");
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "modulePath": "temp",
        "packageJson": Object {
          "dependencies": Object {},
          "devDependencies": Object {
            "jest": "^27.0.6",
          },
          "engines": Object {
            "node": ">=14",
          },
          "name": "test-package-name",
        },
        "toolOptions": Object {
          "coverage": Object {
            "branches": 95,
            "functions": 96,
            "ignore": Array [
              "-io",
            ],
            "lines": 95,
            "statements": 97,
          },
          "linting": Object {
            "ignore": Array [
              "-io",
            ],
          },
          "profileName": "ts-lib",
          "sizeLimitKB": 10,
        },
      }
    `);
  });
});
