#!/usr/bin/env node

import { commanding } from '../dist/baldrick-dev-ts.esm.js';

try {
  await commanding.parseAsyncArgv();
} catch (err) {
  console.error(err);
  process.exit(1);
}
