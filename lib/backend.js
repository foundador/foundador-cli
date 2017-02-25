#!/usr/bin/env node

(function(exports){
  'use strict';

  const fs      = require('fs');
  const fsextra = require('fs-extra');
  const AWS     = require('aws-sdk');

  const config = require('./config');

  require("util").inspect.defaultOptions.depth = null;

  const backendBaseDir = process.cwd() + '/src/backend/';
  const functionsBaseDir = backendBaseDir + '/functions/';

  AWS.config.update(config.aws);

  exports.cliInit           = cliInit;
  exports.cliTestFunction   = cliTestFunction;
  exports.cliDeployFunction = cliDeployFunction;

  function cliInit() {
    console.log('Running backend setup');
  }

  function cliTestFunction(functionName, eventData) {
    let event = {};
    console.log('Calling:', '"'+functionName+'"');
    eventData.forEach(function(val,key,arr) {
      let splitPos = val.indexOf('=');
      let eventKey = val.substr(0, splitPos);
      let eventVal = val.substr(splitPos+1);
      if(eventKey && eventVal) {
        event[eventKey] = eventVal;
      }
    });
    console.log('Data:', event);
    if(functionNameExists(functionName)) {
      copyShared(functionName, 'dev')
        .then(() => {
          callfunctionNameHandler(functionName, event);
        });
    }
  }

  function cliDeployFunction(functionName, stage, region) {
    stage = stage ? stage : 'dev';
    console.log('Stage:',stage);
    console.log('Deploying:', '"'+functionName+'"');
    deployFunctionName(functionName, region, stage)
      .then(() => {
        console.log('Done');
      }).catch((error) => { console.log('Error:', error); });
  }

  function getFunctionNamePath (functionName) {
    return functionsBaseDir + functionName + '/';
  }

  function callfunctionNameHandler (functionName, event) {
    let functionNameModule;
    if(!event || typeof event != 'object') {
      console.log('Error: Invalid event object');
      return;
    }

    try {
      let functionNameFile = getFunctionNamePath(functionName) + 'index.js';
      functionNameModule = require(functionNameFile);
    } catch (e) {
      console.log('Error requiring functionName "'+functionName+'"');
      console.log(e);
      return;
    }

    if(functionNameModule) {
      if(functionNameModule.handler && typeof functionNameModule.handler == 'function') {
        functionNameModule.handler(event, {}, functionNameCallback);
      } else {
        console.log('Error: Could not find functionName handler "'+functionName+'.handler"');
      }
    }

  }

  function functionNameExists(functionName) {
    let functionNameFile = getFunctionNamePath(functionName) + 'index.js';
    try {
      fs.existsSync(functionNameFile);
    } catch (e) {
      console.log(e);
      console.log('Error: Could not find functionName "'+functionName+'"');
      return false;
    }
    return true;
  }

  function functionNameCallback (err,result) {
    if(err) {
      console.log('Error:',err);
    }
    if(result) {
      console.log('Result:',result);
    }
    process.exit();
  }

  function copyShared (functionName, stage) {
    return new Promise((resolve, reject) => {
      let functionNamePath = getFunctionNamePath(functionName),
          endpointShared   = functionNamePath + '/shared';

      console.log('Removing previous shared resources');
      fsextra.remove(endpointShared, (err) => {
        console.log('Copying shared resources');
        fsextra.copy(backendBaseDir + 'shared/' + stage, endpointShared, (err) => {
          if(err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      });

    });
  }

  function zipFunctionName (functionName, stage) {
    return new Promise((resolve, reject) => {
      copyShared(functionName, stage)
        .then(() => {
          return createZip(functionName, stage);
        }).then((deployFile) => {
          resolve(deployFile);
        }).catch((err) => { reject(err); });
    });
  }

  function createZip (functionName, stage) {
    return new Promise((resolve,reject) => {
      if(!functionName) {
        let error = 'No functionName specified';
        reject(error);
      }

      let archiver = require('archiver');

      let deployDir   = backendBaseDir + 'deploy/',
        deployFname = getFunctionName(functionName),
        deployFile  = deployDir + deployFname + '.zip',
        deployZip   = fs.createWriteStream(deployFile);

      let archive = archiver('zip');

      deployZip.on('close', function () {
        let fileSize = humanFileSize(archive.pointer());
        console.log('Success: "'+deployFile+'" ('+fileSize+') has been created successfully');
        resolve(deployFile);
      });

      archive.on('error', function(err){
        resolve(err);
      });

      archive.pipe(deployZip);
      archive.directory(getFunctionNamePath(functionName), '/');
      archive.finalize();

    });
  }

  function getFunctionName (functionName) {
    functionName = functionName.replace(/\//g,'-');
    return functionName;
  }

  function getDeployFile (deployFile) {
    return new Promise((resolve, reject) => {
      fs.readFile(deployFile, function (err, data) {
          if (err) {
          reject(err);
          } else {
          resolve(data);
          }
      });
    });
  }

  function createOrUpdateLambdaFunction(inputFunctionName, file, region, stage) {
    return new Promise((resolve, reject) => {

      if(region) {
        AWS.config.region = region;
      }

      let lambda     = new AWS.Lambda(),
        s3           = new AWS.S3(),
        functionName = 'flowpay-' + stage + '-' + getFunctionName(inputFunctionName);

      console.log('Checking for lambda function:', functionName);

      lambda.getFunction({ FunctionName: functionName }, (err, data) => {
        if (err) {
          // Create function
          let params = {
            FunctionName : functionName,
            Handler    : 'index.handler',
            Role     : apiRoleArn,
            Runtime    : 'nodejs4.3',
            Code     : {
              ZipFile : file
            }
          };
          console.log('Creating Lambda function');
          lambda.createFunction(params, function(err, data) {
            if (err) {
              reject(err);
            } else {
              console.log('Success: Created Lambda function:', functionName);
              resolve(true);
            }
          });
        }  else {
          // Update function
          let params = {
            FunctionName : functionName,
            ZipFile    : file
          };
          console.log('Updating Lambda function');
          lambda.updateFunctionCode(params, (err, data) => {
            if(err) {
              reject(err);
            } else {
              console.log('Success: Updated Lambda function:', functionName);
              resolve(true);
            }
          });
        }
      });

    });
  }

  function deployFunctionName (functionName, region, stage) {
    return new Promise((resolve, reject) => {
      zipFunctionName(functionName, stage)
        .then((deployFile) => {
          return getDeployFile(deployFile);
        }).then((file) => {
          resolve(createOrUpdateLambdaFunction(functionName, file, region, stage));
        }).catch((error) => { console.log('Error:', error); });

    });
  }

  function humanFileSize(size) {
    if(size < 1) {
      return '0B';
    }
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
  }

}(exports));
