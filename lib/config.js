const process = require('process');

const config = {};

config.aws = {
  correctClockSkew : true,
  region          : '',
  accessKeyId     : '',
  secretAccessKey : ''
};

config.srcBaseDir       = process.cwd() + '/src/';
config.cliBaseDir       = config.srcBaseDir +  'cli/';

config.webBaseDir       = config.srcBaseDir +  'web/';
config.mobileBaseDir    = config.mobileBaseDir +  'mobile/';
config.backendBaseDir   = config.srcBaseDir + 'backend/';
config.functionsBaseDir = config.backendBaseDir + 'functions/';


module.exports = config;
