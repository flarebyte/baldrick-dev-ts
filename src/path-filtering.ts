import { FileInfoFilter, PathInfo } from './model';

export const byFlag =
  (flag: string) =>
  (pathInfo: PathInfo): boolean =>
  pathInfo.flags.includes(flag) ;


export const stringToFilter = (_query: string): FileInfoFilter => {
  return { kind: 'unknown'}
}

export const filterToString = (_query: FileInfoFilter): string => {
  return ""
}
