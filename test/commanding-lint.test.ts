import { Commanding } from '../src/commanding';

interface Example {
  given: string[];
}

const examples: Example[] = [
  {
    given: [
      'find:',
      'data/*.json',
      'with-path-containing:',
      'author',
      'check-json-schema:',
      'schemas/author.schema.json',
    ],
  },
];

describe('Commands Lint', () => {
  const commanding = new Commanding();
  commanding.declareLintAction(jest.fn());

  it.each(examples)('check each json with schemas $given', ({ given }) => {
    commanding.parse(['node', 'baldrick', 'lint', ...given]);
    expect(commanding.getInstrumentation().getLastRecord().params).toEqual(
      given
    );
  });
});
