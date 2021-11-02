import { Commanding } from '../src/commanding';
import { LintAction, LintActionOpts, RunnerContext } from '../src/model';

interface Example {
  given: string[];
}

const examples: Example[] = [
  {
    given: [
      '--with-path-starting',
      'src',
      '--ecma-version',
      '2018'
    ],
  },
];
const mockLintAction: LintAction = async (_ctx: RunnerContext, _opts: LintActionOpts) => {
  await Promise.resolve('does not matter')
}

describe('Commands Lint', () => {
  const commanding = new Commanding();
  commanding.declareLintAction(mockLintAction);

  it.each(examples)('check each json with schemas $given', ({ given }) => {
    commanding.parse(['node', 'baldrick', 'lint', ...given]);
    const { params } = commanding.getInstrumentation().getLastRecord()
    expect(params).toHaveLength(2);
    expect(params[0]).toContain('/baldrick-dev-ts')
    expect(params[1]).toStrictEqual('{}')
  });
});
