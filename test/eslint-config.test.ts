import { computeEsLintConfig } from "../src/eslint-config";
import { simpleLintOpts } from "./fixture-linting";
import { simpleToolOptions } from "./fixture-tool-opts";

describe("eslint-config", () => {
  it("should produce a valid config", () => {
    const localSetup = {
      modulePath: "module-path",
      toolOptions: simpleToolOptions,
    };
    const opts = simpleLintOpts;
    const actual = computeEsLintConfig(localSetup, opts);
    expect(actual).toMatchInlineSnapshot(
      `
      Object {
        "baseConfig": Object {
          "extends": Array [
            "prettier/@typescript-eslint",
            "plugin:prettier/recommended",
          ],
          "settings": Object {},
        },
        "extensions": Array [
          ".ts",
          ".tsx",
        ],
        "fix": true,
        "ignorePattern": Array [
          "-generated",
        ],
      }
    `
    );
  });
});
