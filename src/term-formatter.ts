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

  console.info(` ★ ${params.title} ⇨`, detail);
};

export const errorFormatter = (params: ErrTermFormatterParams) => {
  console.error(` ★ ${params.title} ⇨`, params.detail);
};
