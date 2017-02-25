#!/usr/bin/env node
(function(exports){
  'use strict';

  const program = require('commander');
  const cli     = require(__dirname + '/lib/cli');
  const info    = require('./package.json');

  program
    .version(info.version);

  program
    .command('init')
    .action(() => {
      cli.cliInit();
    });

  program
    .command('setup')
    .action(() => {
      cli.cliSetup();
    });

  program
    .command('backend', 'setup create test')
    .command('mobile',  'setup run-ios run-android')
    .command('web',     'setup dev');

  program.parse(process.argv);

}(exports));
