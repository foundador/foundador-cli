(function (exports) {
  "use strict";

  const lpf = require("./shared/lambdaProxyFunctions");

  exports.handler = (event, context, callback) => {

    const eventData = lpf.getEventData(event);

    let errors = [];
    if(errors.length > 0 ) {
      return callback(null, lpf.proxyResponse(400,lpf.prepareError(errors)));
    }

    const response = {
      hello : "world"
    }

    callback(null, lpf.proxyResponse(200, response))

  };

}(exports));
