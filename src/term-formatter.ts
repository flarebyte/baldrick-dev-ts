import { TermFormatterParams } from './model';

export const basicFormatter = (params: TermFormatterParams) => {
  console.info(` ★ ${params.title} ★`);
  console.info(params.detail);
};
