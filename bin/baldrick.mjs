#!/usr/bin/env node

import { commanding } from '../dist/baldrick-dev-ts.esm.js'

async function main() {
    await commanding.parseAsync(process.argv);
  }
  try {
    await main();
  } catch (err) {
    console.error(err);
  }