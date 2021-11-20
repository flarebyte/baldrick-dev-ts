import { computeEsLintConfig } from '../src/eslint-config';
import { LintResolvedOpts } from '../src/model';

describe('eslint-config', () => {
  it('should produce a valid config', () => {
    const resolvedOps: LintResolvedOpts = {
      modulePath: 'module-path',
      mode: 'check',
      pathPatterns: [],
      ecmaVersion: 2018,
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
          ],
          "parser": "@typescript-eslint/parser",
          "parserOptions": Object {
            "ecmaVersion": 2018,
            "sourceType": "module",
          },
          "plugins": Array [
            "@typescript-eslint",
            "prettier",
            "jest",
            "import",
          ],
          "root": true,
          "rules": Object {
            "prettier/prettier": "error",
          },
          "settings": Object {},
        },
        "extensions": Array [
          ".ts",
          ".json",
        ],
        "fix": false,
      }
    `);
  });
});
