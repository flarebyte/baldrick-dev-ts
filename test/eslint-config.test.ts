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
