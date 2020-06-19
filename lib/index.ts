#!/usr/bin/env node

import yargs from 'yargs';

import { setupCommand } from './command';

yargs.command(setupCommand()).help().argv;
