import { toMergedPathInfos, toPathInfo, toPathInfos } from '../src/path-transforming';
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

describe('toPathInfos', () => {
  it('should convert a content files ignoring empty lines and comments', () => {
    const given = [
      'dir1/dir2/index1.ts;@load',
      ' ',
      ' dir1/dir2/index2.ts ; first second ',
      '',
      '# ignore/me',
      'dir1/dir2/index3.ts;',
    ].join('\n');
    const actual = toPathInfos(given);
    expect(actual).toHaveLength(3);
    expect(actual[0].path).toStrictEqual('dir1/dir2/index1.ts');
    expect(actual[1].path).toStrictEqual('dir1/dir2/index2.ts');
    expect(actual[2].path).toStrictEqual('dir1/dir2/index3.ts');
  });
});

describe('toMergedPathInfos', () => {
  it('should merge multiple content files ignoring empty lines and comments and duplicates', () => {
    const given1 = [
      'dir1/dir2/index1.ts;@load',
      ' ',
      ' dir1/dir2/index2.ts ; first second ',
      '',
      '# ignore/me',
      'dir1/dir2/index3.ts;',
    ].join('\n');

    const given2 = [
      'dir1/dir2/index4.ts;@load',
      ' ',
      ' dir1/dir2/index2.ts ; first second ',
      '',
      '# ignore/me',
      'dir1/dir2/index5.ts;',
    ].join('\n');
    const actual = toMergedPathInfos([given1, given2]);
    expect(actual).toHaveLength(5);
    expect(actual[0].path).toStrictEqual('dir1/dir2/index1.ts');
    expect(actual[1].path).toStrictEqual('dir1/dir2/index2.ts');
    expect(actual[2].path).toStrictEqual('dir1/dir2/index3.ts');
    expect(actual[3].path).toStrictEqual('dir1/dir2/index4.ts');
    expect(actual[4].path).toStrictEqual('dir1/dir2/index5.ts');
  });
});
