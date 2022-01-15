#!/usr/bin/env node

import { commanding } from './index.js';
const redFailure = '\x1b[31m❌ Failure\x1b[0m';

/**
 * This function may be merged in the future when the linter does a better job at recognizing .mts files
 */
export async function runClient() {
  try {
    await commanding.parseAsyncArgv();
  } catch (err) {
    console.log(`${redFailure} Baldrick will exit with error code 1`);
    process.exit(1);
  }
}
