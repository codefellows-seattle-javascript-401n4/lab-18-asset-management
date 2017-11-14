'use strict';

const jwt = require('jsonwebtoken');
const User = require(__dirname + '/../models/user');

module.exports = (req, res, next) => {

  //check for authorization
  if (!req.headers.authorization) {
    throw new Error('You must authorize');
  }
  //check for a jwt
  let token = req.headers.authorization.split('Bearer ')[1];
  if (!token) {
    next({statusCode: 401, err: new Error('Invalid Authorization Provided')});
  }

  //extract the Id
  let secret = process.env.SECRET || 'changethis';
  let decodedToken = jwt.verify(token, secret);
  req.userId = decodedToken.id;
  User.findOne({_id: req.userId})
    .then(user => {
      if(!user) next ({statusCode: 401, err: new Error('User Not Found With The Corresponding JWT')});
      req.user = user;
      next();
    });
};
