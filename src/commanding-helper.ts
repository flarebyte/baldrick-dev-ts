import { Option } from 'commander';
import camelCase from 'camelcase';
import { CmdOption } from './model';

export const toCommanderOption = (option: CmdOption): Option => {
  const flags = `-${option.shortFlag}, --${option.longFlag} [${camelCase(
    option.longFlag
  )}...]`;
  const opts = new Option(flags, option.description);
  opts.defaultValue = option.defaultValue;
  if (option.choices.length > 0) {
    opts.choices(option.choices);
  }
  return opts;
};

