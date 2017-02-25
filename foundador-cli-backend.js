#!/usr/bin/env node
(function(exports){
  'use strict';

  const libDir  = __dirname + '/lib';
  const config  = require(libDir + '/config');
  const program = require('commander');
  const info    = require('./package.json');

  program
    .version(info.version);

  const backendCli = require(libDir + '/backend');

  program
    .command('init')
    .action(function (functionName, eventData) {
      backendCli.cliInit();
    });

  program
    .command('test <function> [eventData...]')
    .action(function (functionName, eventData) {
      backendCli.cliTestFunction(functionName, eventData);
    });

  program
    .command('deploy <function> [stage] [region]')
    .action(function (functionName, stage, region) {
      backendCli.cliDeployFunction(functionName, state, region);
    });

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }

  program.parse(process.argv);

}(exports));
