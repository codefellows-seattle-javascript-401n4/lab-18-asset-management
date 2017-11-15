'use strict';

module.exports = (err, req, res, next) => {

  console.log(err);
  res.status(500 || err.statusCode).send(err.message || 'server error');
  next();
};