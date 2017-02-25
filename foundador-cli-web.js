#!/usr/bin/env node
(function(exports){
  'use strict';

  const libDir  = __dirname + '/lib';
  const config  = require(libDir + '/config');
  const program = require('commander');
  const info    = require('./package.json');

  program
    .version(info.version);

  const webCli = require(libDir + '/web');

  program
    .command('setup')
    .action(function (functionName, eventData) {
      webCli.cliSetup();
    });

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }

  program.parse(process.argv);

}(exports));
