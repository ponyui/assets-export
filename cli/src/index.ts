#!/usr/bin/env node

import { Command } from 'commander';

import initCommand from './init.js';
import importCommand from './import.js';

const program = new Command();

program
  .name('ponyui-assets')
  .description(
    'CLI to export assets from Figma. Works in tandem with PonyUI Assets Export Plugin.',
  );

program.addCommand(initCommand());
program.addCommand(importCommand());

program.parse(process.argv);
