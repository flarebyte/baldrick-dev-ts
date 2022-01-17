import { getYarnVersions } from './execa-helper.js';
import { version } from './version.js';

export const getVersionsSummary = async (): Promise<string> => {
  const yarnVersions = await getYarnVersions();
  return [
    `baldrick-dev-ts version: ${version}`,
    `node.js: ${yarnVersions.data?.node}`,
    `yarn: ${yarnVersions.data?.yarn}`,
    `v8: ${yarnVersions.data?.v8}`,
  ].join(', ');
};
