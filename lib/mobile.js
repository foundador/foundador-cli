#!/usr/bin/env node
(function(exports){
  'use strict';

  const config = require('./config');
  const spawn  = require('child_process').spawn;

  exports.cliInit = cliInit;

  function cliInit() {
    console.log('Running mobile init');
  }

}(exports));
