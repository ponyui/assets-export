#!/usr/bin/env node

import { Command } from 'commander';
import Mixpanel from 'mixpanel';

import initCommand from './init.js';
import importCommand from './import.js';

const mixpanel = Mixpanel.init('041febc79b4cba38f049313e2feef0b0');

const program = new Command();

program
  .name('ponyui-assets')
  .description(
    'CLI to export assets from Figma. Works in tandem with PonyUI Assets Export Plugin.',
  );

program.addCommand(initCommand(mixpanel));
program.addCommand(importCommand(mixpanel));

program.parse(process.argv);
