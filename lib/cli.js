#!/usr/bin/env node
(function(exports){
  'use strict';

  const config  = require('./config');
  const fse     = require('fs-extra');
  const process = require('process');
  const prompt  = require('prompt');

  const backendCli = require('./backend');
  const mobileCli  = require('./mobile');
  const webCli     = require('./web');

  exports.cliInit  = cliInit;
  exports.cliSetup = cliSetup;

  function cliInit() {
    console.log('Initializing new startup');

    prompt.message = '';

    var schema = {
      properties : {
        name : {
          description : 'Startup name',
          required    : true,
          message     : 'Startup name is required'
        },
        backend : {
          description : 'Backend',
          type        : 'string',
          pattern     : /^[YyNn]{1}$/,
          default     : 'Y',
          message     : 'Do you need a backend?'
        },
        mobile : {
          description : 'Mobile',
          type        : 'string',
          pattern     : /^[YyNn]{1}$/,
          default     : 'Y',
          message     : 'Do you need a mobile app?'
        },
        web : {
          description : 'Web',
          type        : 'string',
          pattern     : /^[YyNn]{1}$/,
          default     : 'Y',
          message     : 'Do you need a web app?'
        }
      }
    };


    promptGet(schema)
      .then(prepareConfig)
      .then(ensureDirs)
      .then(initDomains)
      .then(() => {
        console.log('done');
      }).catch((err) => {
        console.log('An error has occurred:');
        console.log(err);
      });
  }

  function cliSetup() {
    console.log('Running web setup');
  }

  function promptGet(schema) {
    return new Promise((resolve, reject) => {
      prompt.start();
      prompt.get(schema, function(err,result) {
        if(err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  function prepareConfig(promptResult) {
    return new Promise((resolve, reject) => {
      let initConfig = {
        name : promptResult.name,
        src  : __dirname + '/../src/',
        dest : process.cwd() + '/' + promptResult.name,
        domains : {
          backend : promptResult.backend.toLowerCase() == 'y',
          mobile  : promptResult.mobile.toLowerCase() == 'y',
          web     : promptResult.web.toLowerCase() == 'y'
        }
      };
      resolve(initConfig);
    });
  }

  function ensureDirs(initConfig) {
    return new Promise((resolve, reject) => {
      ensureDir(initConfig.dest)
        .then(ensureDir(initConfig.dest + '/src'))
        .then(copy(initConfig.src + '/shared', initConfig.dest + '/src/shared'))
        .then(() => {
          resolve(initConfig);
        }).catch((err) => {
          console.log('An error has occurred:');
          console.log(err);
          reject(err);
        })
    });
  }

  function initDomains(initConfig) {
    return new Promise((resolve, reject) => {
      let promises = [];
      for(var domain in initConfig.domains) {
        const bool = initConfig.domains[domain];
        if(bool) {
          promises.push(copy(initConfig.src+'/'+domain, initConfig.dest+'/src/'+domain));
        }
      }
      Promise.all(promises)
        .then(() => {
          resolve(initConfig);
        }).catch((err) => { reject(err); });
    });
  }

  function initDomain(dir) {
    return new Promise((resolve, reject) => {
      const spawn   = require('child_process').spawn;
      const npmInit = spawn('cmd', ['npm','init'], {
        cwd : dir
      });
      let error = false;
      npmInit.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
      npmInit.stderr.on('data', (data) => {
        error = true;
        console.log(`stderr: ${data}`);
      });
      npmInit.on('error', ((err) => {
        console.log(err);
        reject(err);
      }));
      npmInit.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if(error) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }

  function ensureDir(dirname) {
    return new Promise((resolve, reject) => {
      fse.ensureDir(dirname, (err) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function copy(src, dest, options) {
    return new Promise((resolve, reject) => {
      fse.copy(src,dest,options, (err) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }


}(exports));
