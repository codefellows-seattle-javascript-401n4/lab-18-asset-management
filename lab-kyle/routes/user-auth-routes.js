'use strict';

const debug = require('debug')('basicA:user-auth-routes');

const User = require('../models/user');
const errorHandler = require('../lib/middleware/error-handler');
const basicAuth = require('../lib/middleware/basic-auth');

module.exports = function(router) {

  router.post('/api/signup', (req, res) => {
    debug('POST /api/signup');

    let pw = req.body.password;
    delete req.body.password;

    let user = new User(req.body);

    user.generatePasswordHash(pw)
      .then(user => user.save())
      .then(user => user.generateToken())
      .then(token => res.send(token))
      .catch(err => errorHandler(err, req, res));
  });

  router.get('/api/signin', basicAuth, (req, res) => {
    debug('GET /api/signin');

    return User.findOne({ username: req.auth.username })
      .then(user => user.comparePasswordHash(req.auth.password))
      .then(user => user.generateToken())
      .then(token => res.send(token))
      .catch(err => errorHandler(err, req, res));
  });

};
