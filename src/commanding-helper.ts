import { InvalidArgumentError } from 'commander';

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