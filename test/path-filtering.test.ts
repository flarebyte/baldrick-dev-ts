import { PathInfo } from '../src/model';
import { byFlag, filterToSubscript, subscriptToFilter } from '../src/path-filtering'
import { asPath } from '../src/path-transforming'

const examples: PathInfo[] = [
  {
    path: 'package.json',
    tags: ['json'],
  },
  {
    path: 'README.md',
    tags: ['md'],
  },
  {
    path: 'src/index.ts',
    tags: ['ts'],
  },
  {
    path: 'src/data.json',
    tags: ['json'],
  },
  {
    path: 'src/alpha.ts',
    tags: ['ts'],
  },
  {
    path: 'src/bravo.ts',
    tags: ['ts'],
  },
  {
    path: 'src/charlie.ts',
    tags: ['ts', 'charlie'],
  },
  {
    path: 'test/index.test.ts',
    tags: ['ts'],
  },
  {
    path: 'test/alpha.test.ts',
    tags: ['ts'],
  },
  {
    path: 'test/bravo.test.ts',
    tags: ['ts'],
  },
  {
    path: 'test/charlie.test.ts',
    tags: ['ts', 'charlie'],
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
    const givenQuery = ['with-path-containing:', 'test']
    const actualFilter = subscriptToFilter(givenQuery)
    const actualQuery = filterToSubscript(actualFilter)
    expect(actualQuery).toEqual(givenQuery)
  });
  
});
