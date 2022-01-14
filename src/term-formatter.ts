import chalk from 'chalk';
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
    console.info(chalk.blue(' ✸ ') + `${params.title} ⇨`, detail);
  }

  if (params.kind === 'success') {
    console.info(chalk.green(' ✔ Success ') + `${params.title} ⇨`, detail);
  }
};

export const errorFormatter = (params: ErrTermFormatterParams) => {
  console.error(chalk.red('❌ Failure ') + `${params.title} ⇨`, params.detail);
};
