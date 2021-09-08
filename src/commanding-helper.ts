import { InvalidArgumentError } from 'commander';
import { Option } from 'commander';
import camelCase from 'camelcase';
import { CmdOption } from './model';

export function parseEcma(value: string): number {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('A valid Ecma version should be a number');
  }
  if (parsedValue < 2000) {
    throw new InvalidArgumentError('Not a valid Ecma version');
  }
  return parsedValue;
}

export const toCommanderOption = (option: CmdOption): Option => {
  const flags = `-${option.shortFlag}, --${option.longFlag} [${camelCase(
    option.longFlag
  )}...]`;
  return new Option(flags, option.description);
};

