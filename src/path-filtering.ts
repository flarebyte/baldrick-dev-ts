import { FileFiltering, PathInfo } from './model';

export const byFileQuery =
  (query: FileFiltering) =>
  (pathInfo: PathInfo): boolean => {
    return (
      (query.withPathStarting.some(pathInfo.path.startsWith) ||
        query.withExtension.some(pathInfo.path.endsWith) ||
        query.withPathSegment.some(pathInfo.path.includes) ||
        query.withTag.some(pathInfo.tags.includes)) &&
      !(
        query.withoutPathStarting.some(pathInfo.path.startsWith) ||
        query.withoutExtension.some(pathInfo.path.endsWith) ||
        query.withoutPathSegment.some(pathInfo.path.includes) ||
        query.withoutTag.some(pathInfo.tags.includes)
      )
    );
  };
