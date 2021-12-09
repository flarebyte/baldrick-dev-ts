import fs from 'fs-extra';
import { TscOptionsConfig } from './model';

export async function cleanDistFolder(distFolder: string) {
  await fs.remove(distFolder);
  await fs.mkdir(distFolder);
}

export const buildBundle = async (opts: TscOptionsConfig) => {
  return Promise.resolve(opts);
};
