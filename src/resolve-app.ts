import fs from 'fs-extra';
import path from 'path';

export const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = function (relativePath: string) {
  return path.resolve(appDirectory, relativePath);
};
