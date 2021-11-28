#!/usr/bin/env node

import { commanding } from './index.js';

try {
  await commanding.parseAsyncArgv();
} catch (err) {
  console.log('Baldrick will exit with error code 1');
  process.exit(1);
}
