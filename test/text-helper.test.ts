import { normalizeMdLine, wrapWord } from '../src/text-helper';
const loremIpsum = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ',
  'sed do eiusmod tempor incididunt ut labore et dolore magna',
  ' aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  ' ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  ' Duis aute irure dolor in reprehenderit in voluptate velit,',
  ' esse cillum dolore eu fugiat nulla pariatur. Excepteur sint',
  ' occaecat cupidatat non proident, sunt in culpa qui officia',
  ' deserunt mollit anim id est laborum.',
].join('');

describe('text-helper', () => {
  it('should wrap word', () => {
    const actual = wrapWord(30, loremIpsum);
    expect((actual[0] || '').length).toBeLessThanOrEqual(30);
    expect(actual).toMatchInlineSnapshot(`
      "Lorem ipsum dolor sit amet,
      consectetur adipiscing elit, sed
      do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut
      enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi
      ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in
      reprehenderit in voluptate velit,
      esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in
      culpa qui officia deserunt mollit
      anim id est laborum."
    `);
  });
});

describe('normalizeMdLine', () => {
  it('should wrap word for paragraph', () => {
    const actual = normalizeMdLine(loremIpsum);
    expect(actual).toMatchInlineSnapshot(`
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
      ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit, esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    `);
  });
  it('should wrap word for quote', () => {
    const actual = normalizeMdLine(` > ${loremIpsum}`);
    expect(actual).toMatchInlineSnapshot(`
      " > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
      irure dolor in reprehenderit in voluptate velit, esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
      deserunt mollit anim id est laborum."
    `);
  });
  it('should wrap word for unordered list', () => {
    const actual = normalizeMdLine(` - ${loremIpsum}`);
    expect(actual).toMatchInlineSnapshot(`
      " -   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
      irure dolor in reprehenderit in voluptate velit, esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
      deserunt mollit anim id est laborum."
    `);
  });
  it('should wrap word for unordered list with leading spaces', () => {
    const actual = normalizeMdLine(`    - ${loremIpsum}`);
    expect(actual).toMatchInlineSnapshot(`
      "    -   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
      irure dolor in reprehenderit in voluptate velit, esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
      deserunt mollit anim id est laborum."
    `);
  });
  it('should wrap word for ordered list', () => {
    const actual = normalizeMdLine(` 1. ${loremIpsum}`);
    expect(actual).toMatchInlineSnapshot(`
      " 1.   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
      irure dolor in reprehenderit in voluptate velit, esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
      deserunt mollit anim id est laborum."
    `);
  });
  it('should ignore header', () => {
    const actual = normalizeMdLine(` ## ${loremIpsum}`);
    expect(actual).toMatchInlineSnapshot(
      `" ## Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit, esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."`
    );
  });
  it('should ignore code block', () => {
    const actual = normalizeMdLine(`    ${loremIpsum}`);
    expect(actual).toMatchInlineSnapshot(
      `"    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit, esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."`
    );
  });
  it('should ignore table', () => {
    const actual = normalizeMdLine(`|ab|b|d|${loremIpsum}`);
    expect(actual).toMatchInlineSnapshot(
      `"|ab|b|d|Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit, esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."`
    );
  });
});
