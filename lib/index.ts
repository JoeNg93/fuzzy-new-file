#!/usr/bin/env node

import yargs from 'yargs';
import semver from 'semver';

import { setupCommand } from './command';

function nodeVersionHigherOrEqual(minVersion: string) {
  return semver.gte(
    process.version,
    semver.coerce(minVersion) as semver.SemVer
  );
}

function main() {
  if (!nodeVersionHigherOrEqual('v10')) {
    process.stderr.write(
      `ERROR: This CLI requires Node v10 or above, your current version: ${process.version}\n`
    );
    process.exit(1);
  }

  yargs.command(setupCommand()).help().argv;
}

main();
