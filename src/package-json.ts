import fs from 'fs/promises';

export type PackageJson = {
  name: string;
  description: string;
  version: string;
};

export const readPackageJson = async (): Promise<PackageJson> => {
  const content = await fs.readFile('./package.json', 'utf8');
  const contentJson: PackageJson = JSON.parse(content);
  return contentJson;
};
