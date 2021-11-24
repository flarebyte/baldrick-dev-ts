import { Option, Argument } from 'commander';
import { CmdOption } from './model';

const capitalize = (value: string): string =>
  value.length > 0 ? (value[0] || '').toUpperCase() + value.substring(1) : '';

const decapitalize = (value: string): string =>
  value.length > 0 ? (value[0] || '').toLowerCase() + value.substring(1) : '';

export const toCamelCase = (longFlag: string): string =>
  decapitalize(longFlag.split('-').map(capitalize).join(''));

export const toCommanderOption = (option: CmdOption): Option => {
  const flags = `-${option.shortFlag}, --${option.longFlag} [${toCamelCase(
    option.longFlag
  )}...]`;
  const opts = new Option(flags, option.description);
  opts.defaultValue = option.defaultValue;
  if (option.choices.length > 0) {
    opts.choices(option.choices);
  }
  return opts;
};

export const toCommanderArgument = (option: CmdOption): Argument => {
  const opts = new Argument(`<${option.longFlag}>`, option.description);
  if (option.choices.length > 0) {
    opts.choices(option.choices);
  }
  return opts;
};
