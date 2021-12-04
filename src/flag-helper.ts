import { SupportedFlag } from './model';

export const satisfyFlag = (
  expected: SupportedFlag,
  flags: SupportedFlag[]
): boolean => flags.some((flag) => flag === expected);

const toSupportedFlag = (flag: string): SupportedFlag => {
  if (flag === 'aim:fix') return 'aim:fix';
  if (flag === 'aim:check') return 'aim:check';
  if (flag === 'aim:ci') return 'aim:ci';
  if (flag === 'aim:cov') return 'aim:cov';
  if (flag === 'globInputPaths:false') return 'globInputPaths:false';
  return 'unknown';
};

export const toSupportedFlags = (flags: string[]): SupportedFlag[] =>
  flags.map(toSupportedFlag);
