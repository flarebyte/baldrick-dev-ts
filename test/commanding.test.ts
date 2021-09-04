import { Commanding } from '../src/commanding';

describe('Commands', () => {
  const commanding = new Commanding();
  commanding.declareGlobAction(jest.fn());

  beforeEach(() => {
    commanding.getInstrumentation().reset();
  });

  it.skip('rehearse help', () => {
    commanding.parse(['help']);
    expect(commanding.getInstrumentation().getLastRecord().params).toEqual([]);
  });
  it.skip('rehearse version', () => {
    commanding.parse(['version']);
    expect(commanding.getInstrumentation().getLastRecord().params).toEqual([]);
  });

  it('rehearse parsing', () => {
    const given = ['find:', 'src/*.ts', '.eslint.json'];
    commanding.parse(['node', 'baldrick', 'do', ...given]);
    expect(commanding.getInstrumentation().getLastRecord().params).toEqual(
      given
    );
  });
});
