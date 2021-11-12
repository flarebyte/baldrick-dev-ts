import { TermFormatterFormat, TermFormatterParams } from './model';

const simplifyJson = (value: string): string => value.replace(/["']/g, ' ')

const toJsonish = (format: TermFormatterFormat, value: object): string =>
format === 'human' ? simplifyJson(JSON.stringify(value)): JSON.stringify(value);

export const basicFormatter = (params: TermFormatterParams) => {
  const detail =
     typeof params.detail === 'string'
      ? params.detail
      : toJsonish(params.format, params.detail);

  console.info(` ★ ${params.title} ⇨`, detail);
};
