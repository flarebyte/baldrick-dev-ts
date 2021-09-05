import { FileInfoFilter, PathInfo } from './model';

export const byFlag =
  (flag: string) =>
  (pathInfo: PathInfo): boolean =>
  pathInfo.flags.includes(flag) ;


export const subscriptToFilter = (_query: string[]): FileInfoFilter => {
  return { kind: 'unknown'}
}

export const filterToSubscript = (_query: FileInfoFilter): string[] => {
  return []
}
