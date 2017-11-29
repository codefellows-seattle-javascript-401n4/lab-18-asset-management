'use strict';

let required = {
  user: ['name'],
  filemetadata: ['path', 'description', 'name'],
};

//FROM: mdn on custom errors
class ServerError extends Error {
  constructor(status = 400, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);
    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, ServerError);

    // Custom debugging information
    this.status = status;
  }

  checkRequired(type, object){
    let errorMess = 'errors:';
    let validationFail = false;
    required[type].forEach((ele) => {
      if (!object[ele]) {
        errorMess = errorMess + ` need a ${ele},`;
        validationFail = true;
      }
    });
    if (validationFail) {
      this.message = errorMess;
      this.status = 400;
    }
  }
}


module.exports = ServerError;
