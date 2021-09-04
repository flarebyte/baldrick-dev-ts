import { PathInfo } from '../src/model';
import { byFlag, filterToString, stringToFilter } from '../src/path-filtering'
import { asPath } from '../src/path-transforming'

const examples: PathInfo[] = [
  {
    path: 'package.json',
    flags: ['json'],
  },
  {
    path: 'README.md',
    flags: ['md'],
  },
  {
    path: 'src/index.ts',
    flags: ['ts'],
  },
  {
    path: 'src/data.json',
    flags: ['json'],
  },
  {
    path: 'src/alpha.ts',
    flags: ['ts'],
  },
  {
    path: 'src/bravo.ts',
    flags: ['ts'],
  },
  {
    path: 'src/charlie.ts',
    flags: ['ts', 'charlie'],
  },
  {
    path: 'test/index.test.ts',
    flags: ['ts'],
  },
  {
    path: 'test/alpha.test.ts',
    flags: ['ts'],
  },
  {
    path: 'test/bravo.test.ts',
    flags: ['ts'],
  },
  {
    path: 'test/charlie.test.ts',
    flags: ['ts', 'charlie'],
  },
];

describe('Path filtering', () => {
  it('should filter by flag name', () => {
    const actual = examples.filter(byFlag('json'))
    expect(actual).toHaveLength(2)
    expect(actual.map(asPath)).toEqual(['package.json', 'src/data.json'])
  });
  it.todo('filter a list of files by flags and regex');
});

describe('Conversion between string and filter', () => {
  it('should create a simple filter', () => {
    const givenQuery = 'tag:equal json'
    const actualFilter = stringToFilter(givenQuery)
    const actualQuery = filterToString(actualFilter)
    expect(actualQuery).toEqual(givenQuery)
  });
  
});
