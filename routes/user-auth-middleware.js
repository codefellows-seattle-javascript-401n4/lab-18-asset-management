'use strict';
const User = require(__dirname + '/../models/user');


let userHandler = module.exports = {};

userHandler.getUserByName = (req, res, next) => {
  console.log(req.auth.username);
  User.findOne({username: req.auth.username})
    .then(user => {
      if (!user) {
        return next({statusCode: 400, message: 'no user'});
      }
      req.user = user;
      next();
    })
    .catch(next);
};

userHandler.getUserById = (req, res, next) => {
  User.findOne({_id: req.decodedId})
    .then(user => {
      if (!user) {
        return next({statusCode: 400, message: 'no user'});
      }
      req.user = user;
      next();
    })
    .catch(next);
};
