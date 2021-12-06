import { SupportedFlag } from './model';

export const satisfyFlag = (
  expected: SupportedFlag,
  flags: SupportedFlag[]
): boolean => flags.some((flag) => flag === expected);

const supportedFlags: SupportedFlag[] = [
  'aim:fix',
  'aim:check',
  'aim:ci',
  'aim:cov',
  'globInputPaths:false',
];
const toSupportedFlag = (flag: string): SupportedFlag => {
  const found = supportedFlags.find((f) => f === flag);
  if (!found) {
    throw new Error(`Internal flag is not supported ${flag}`);
  }
  return found;
};

export const toSupportedFlags = (flags: string[]): SupportedFlag[] =>
  flags.map(toSupportedFlag);