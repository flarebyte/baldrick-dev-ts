import { computeEsLintConfig } from '../src/eslint-config.js';
import { LintResolvedOpts } from '../src/model.js';

describe('eslint-config', () => {
  it('should produce a valid config', () => {
    const resolvedOps: LintResolvedOpts = {
      modulePath: 'module-path',
      flags: ['aim:check'],
      pathPatterns: [],
      ecmaVersion: 2021,
    };

    const actual = computeEsLintConfig(resolvedOps);
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "baseConfig": Object {
          "extends": Array [
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
            "prettier",
            "plugin:jest/recommended",
            "plugin:import/recommended",
            "plugin:import/typescript",
            "plugin:unicorn/recommended",
          ],
          "parser": "@typescript-eslint/parser",
          "parserOptions": Object {
            "ecmaVersion": 2021,
            "sourceType": "module",
          },
          "plugins": Array [
            "@typescript-eslint",
            "prettier",
            "jest",
            "import",
            "unicorn",
          ],
          "root": true,
          "rules": Object {
            "import/no-unresolved": Array [
              2,
              Object {
                "ignore": Array [
                  ".js$",
                ],
              },
            ],
            "prettier/prettier": "error",
            "unicorn/no-array-callback-reference": "off",
            "unicorn/no-array-reduce": "error",
            "unicorn/prefer-json-parse-buffer": "off",
            "unicorn/prevent-abbreviations": "off",
          },
          "settings": Object {},
        },
        "extensions": Array [
          ".ts",
          ".mts",
          ".json",
        ],
        "fix": false,
      }
    `);
  });
});
