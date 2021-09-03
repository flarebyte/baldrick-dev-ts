import { PathInfo } from './model';

export const byFlag =
  (flag: string) =>
  (pathInfo: PathInfo): boolean =>
  pathInfo.flags.includes(flag) ;
