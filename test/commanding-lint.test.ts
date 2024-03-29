import { jest } from '@jest/globals';
import { Commanding } from '../src/commanding.js';
import { LintAction } from '../src/model.js';

const actAndGetSecondParam = async (given: string[]) => {
  const commanding = new Commanding();
  const mockedAction = jest.fn();
  commanding.declareLintAction(mockedAction as LintAction);
  await commanding.parseAsync(['node', 'baldrick', 'lint', ...given]);
  const secondParam =
    mockedAction.mock.calls[0] && mockedAction.mock.calls[0][1];
  return secondParam;
};

describe('Commands Lint', () => {
  it('check each json with schemas', async () => {
    const secondParam = await actAndGetSecondParam([
      'check',
      '--with-path-starting',
      'src',
      'test',
      '--ecma-version',
      '2021',
    ]);
    expect(secondParam).toMatchInlineSnapshot(`
      Object {
        "ecmaVersion": 2021,
        "fileSearching": Object {
          "filtering": Object {
            "withExtension": Array [],
            "withPathSegment": Array [],
            "withPathStarting": Array [
              "src",
              "test",
            ],
            "withTag": Array [],
            "withTagStarting": Array [],
            "withoutExtension": Array [],
            "withoutPathSegment": Array [],
            "withoutPathStarting": Array [],
            "withoutTag": Array [],
            "withoutTagStarting": Array [],
          },
          "pathInfos": Array [],
          "useGlob": "auto",
        },
        "flags": Array [
          "aim:check",
        ],
        "reportBase": "report/lint-report",
        "reportDirectory": "report",
        "reportPrefix": "lint-report",
      }
    `);
  });
});
