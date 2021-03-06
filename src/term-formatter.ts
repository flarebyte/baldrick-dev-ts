import { isCI } from './environment.js';
import {
  ErrTermFormatterParams,
  TermFormatterFormat,
  TermFormatterParams,
} from './model.js';

const simplifyObj = (obj: object): object => {
  const values = Object.entries(obj);
  const relevantValues = values.filter(
    (keyObj) => !['[]', '', 'null'].includes(`${keyObj[1]}`)
  );
  return Object.fromEntries(relevantValues);
};

const greenSuccess = isCI() ? '✔ Success' : '\u001B[32m✔ Success\u001B[0m';
const redFailure = isCI() ? '❌ Failure' : '\u001B[31m❌ Failure\u001B[0m';
const blueIntro = isCI() ? ' ✸' : ' \u001B[34m✸\u001B[0m';

const simplifyJson = (value: string): string => value.replace(/["']/g, ' ');

const toJsonish = (format: TermFormatterFormat, value: object): string =>
  format === 'human'
    ? simplifyJson(JSON.stringify(simplifyObj(value)))
    : JSON.stringify(value);

export const basicFormatter = (params: TermFormatterParams) => {
  const detail =
    typeof params.detail === 'string'
      ? params.detail
      : toJsonish(params.format, params.detail);

  if (params.kind === 'info') {
    console.info(` ★ ${params.title} ⇨`, detail);
  }

  if (params.kind === 'intro') {
    console.info(`${blueIntro} ${params.title} ⇨`, detail);
  }

  if (params.kind === 'success') {
    console.info(`${greenSuccess} ${params.title} ⇨`, detail);
  }
};

export const errorFormatter = (params: ErrTermFormatterParams) => {
  console.error(`${redFailure} ${params.title} ⇨`, params.detail);
};
