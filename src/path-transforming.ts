import { PathInfo } from './model';

export const asPath = (pathInfo: PathInfo): string => pathInfo.path;

const splitBySpace = (value: string): string[] =>
  value
    .trim()
    .split(' ')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

export const toPathInfo = (pathAndTags: string): PathInfo => {
  const [pathStr, tagsStr] = pathAndTags.split(';', 2);
  const tags = tagsStr ? splitBySpace(tagsStr) : [];
  return {
    path: pathStr.trim(),
    tags,
  };
};

export const toPathInfos = (content: string): PathInfo[] => {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !line.startsWith('#'));
  const pathInfos = lines.map(toPathInfo);
  return pathInfos;
};
