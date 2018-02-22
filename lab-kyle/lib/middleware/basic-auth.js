'use strict';

const debug = require('debug')('basicA:basicA-middleware');

module.exports = function(req,res,next){
  debug('basic auth');

  let authHead = req.head.authorization;
  if(!authHead) return next(new Error('authorization failed, need the auth headers'));

  let base64Str = authHead.split('Basic ')[1];
  if(!base64Str) return next(new Error('authorization failed, need username and pass'));

  let [username, password] = Buffer.from(base64Str, 'base64').toString().split(':');
  req.auth ={username, password};
  if(!req.auth.username) return next(new Error('authorization failed, need to know you'));
  if(!req.auth.password) return next(new Error('authorization failed, really need to know you'));

  next();
};
