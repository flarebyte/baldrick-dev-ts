import { PathInfo } from "./model";

export const asPath = (pathInfo: PathInfo): string => pathInfo.path

export const toPathInfo = (pathAndTags: string): PathInfo => ({
    path: pathAndTags.split(';')[0],
    tags: []
})