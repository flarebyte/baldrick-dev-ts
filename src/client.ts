#!/usr/bin/env node

import { isCI } from './environment.js';
import { commanding } from './index.js';
const redFailure = isCI() ? '❌ Failure' : '\u001B[31m❌ Failure\u001B[0m';
/**
 * This function may be merged in the future when the linter does a better job at recognizing .mts files
 */
export async function runClient() {
  try {
    await commanding.parseAsyncArgv();
  } catch {
    console.log(`${redFailure} Baldrick will exit with error code 1`);
    process.exit(1);
  }
}
