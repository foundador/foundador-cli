(function (exports) {

  'use strict';

  exports.getEventData = function(event) {
    let returnEvent = {};
    if(event) {
      if(event.body === null) {
        returnEvent = {};
      } else if(typeof event.body == 'string') {
        try {
          returnEvent = JSON.parse(event.body);
        } catch(e) {
          console.log('Error calling JSON.parse on event.body');
        }
      } else if(typeof event.body == 'object') {
        returnEvent = event.body;
      } else {
        returnEvent = event;
      }
    }
    return returnEvent;
  };

  exports.prepareError = function(err) {
    if(err && err.constructor == ReferenceError) {
      err = "" + err;
    }
    let error = {
      error : err + ""
    };
    return error;
  };

  exports.proxyResponse = function(code, data) {
    if(typeof data != 'string') {
      data = JSON.stringify(data);
      if(!data) {
        data = "" + data;
      }
    }
    return {
      statusCode : code,
      body       : data,
      headers    : {
        'Access-Control-Allow-Origin' : '*'
      }
    };
  };

}(exports));
