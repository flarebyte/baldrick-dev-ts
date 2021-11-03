import { Option } from 'commander';
import camelCase from 'camelcase';
import { CmdOption } from './model';

export const toCommanderOption = (option: CmdOption): Option => {
  const flags = `-${option.shortFlag}, --${option.longFlag} [${camelCase(
    option.longFlag
  )}...]`;
  const opts = new Option(flags, option.description);
  opts.defaultValue = [];
  opts.defaultValueDescription = 'none'
  return opts;
};

export const toChoiceCommanderOption = (option: CmdOption, choices: string[], defaultValue: string): Option => {
  const flags = `-${option.shortFlag}, --${option.longFlag} [${camelCase(
    option.longFlag
  )}...]`;
  const opts = new Option(flags, option.description);
  opts.defaultValue = defaultValue;
  opts.choices(choices);
  return opts;
};

