import fs from 'fs-extra';
import path from 'path';
import { rollup, RollupOptions, OutputOptions } from 'rollup';

export const safePackageName = (name: string) =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '');

export const writeCjsEntryFile = (
  modulePath: string,
  distFolder: string,
  name: string
): Promise<void> => {
  const baseLine = `module.exports = require('./${safePackageName(name)}`;
  const contents = `
  'use strict'
  if (process.env.NODE_ENV === 'production') {
    ${baseLine}.cjs.production.min.js')
  } else {
    ${baseLine}.cjs.development.js')
  }
  `;
  return fs.outputFile(path.join(modulePath, distFolder, 'index.js'), contents);
};

export async function cleanDistFolder(distFolder: string) {
  await fs.remove(distFolder);
  await fs.mkdir(distFolder);
}

export const buildBundle = async (
  inputOptions: RollupOptions & { output: OutputOptions }
) => {
  const bundle = await rollup(inputOptions);
  await bundle.write(inputOptions.output);
};
