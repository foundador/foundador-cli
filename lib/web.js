#!/usr/bin/env node
(function(exports){
  'use strict';

  const config = require('./config');
  const spawn  = require('child_process').spawn;

  exports.cliInit = cliInit;
  exports.cliDev  = cliDev;

  function cliInit() {
    console.log('Running web init');
  }

  function cliDev(options) {
    console.log(options);
    process.chdir(config.webBaseDir);
    // spawn('webpack-dev-server');
  }

}(exports));
