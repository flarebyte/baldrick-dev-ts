import { toPathInfo } from '../src/path-transforming';
describe('toPathInfo', () => {
  it('should parse a filename followed by a tag', () => {
    const actual = toPathInfo('dir1/dir2/index.ts;@load');
    expect(actual.path).toStrictEqual('dir1/dir2/index.ts');
    expect(actual.tags).toStrictEqual(['@load']);
  });
  it('should parse a filename followed by two tags', () => {
    const actual = toPathInfo('dir1/dir2/index.ts;@load fix:v2');
    expect(actual.path).toStrictEqual('dir1/dir2/index.ts');
    expect(actual.tags).toStrictEqual(['@load', 'fix:v2']);
  });
  it('should parse a filename without any tags', () => {
    const actual = toPathInfo('dir1/dir2/index.ts');
    expect(actual.path).toStrictEqual('dir1/dir2/index.ts');
    expect(actual.tags).toStrictEqual([]);
  });
  it('should parse a filename without any tags but separator', () => {
    const actual = toPathInfo('dir1/dir2/index.ts;');
    expect(actual.path).toStrictEqual('dir1/dir2/index.ts');
    expect(actual.tags).toStrictEqual([]);
  });
  it('should ignore padding spaces', () => {
    const actual = toPathInfo(' dir1/dir2/index.ts ; first second ');
    expect(actual.path).toStrictEqual('dir1/dir2/index.ts');
    expect(actual.tags).toStrictEqual(['first', 'second']);
  });
});
