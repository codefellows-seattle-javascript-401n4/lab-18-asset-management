'use strict';

const { Router } = require('express');
const jsonParser = require('body-parser').json();
const User = require('../models/user.js');
const httpErrors = require('http-errors');
const basicAuth = require('../lib/basic-http.js');
const userHandler = require('./user-auth-middleware');

module.exports = new Router()
  .post('/signup', jsonParser, (req, res, next) => {
    if(!req.body.username || !req.body.email || !req.body.password)
      return next(httpErrors(400, '__REQUEST_ERROR__ username, email, and password are required'));
    User.create(req.body)
      .then(user => user.createToken())
      .then(token => res.json({token}))
      .catch(next);
  })

  .get('/signin', basicAuth, userHandler.getUserByName, (req, res, next) => {
    if(!req.user)
      return next(httpErrors(401, '__REQUEST_ERROR__ account not found'));
    req.user.createToken()
      .then(token => res.json({token}))
      .catch(next);
  });
