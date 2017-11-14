'use strict';

const User = require(__dirname + '/../models/user');
const basicHTTP = require(__dirname + '/../lib/basic-http');
const jsonParser = require('body-parser').json();
const bearerAuthentication = require(__dirname + '/../lib/bearer-authentication');

const authRouter = module.exports = require('express').Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  const password = req.body.password;
  delete req.body.password;
  (new User(req.body)).generateHash(password)
    .then((user) => {
      user.save()
        //.then(res.send.bind(res))
        .then(user => res.send(user.generateToken()))
        .catch(next);
    })
    .catch(next);
});

authRouter.get('/signin', basicHTTP, (req, res, next) => {
  console.log('hi from authRouter.get /signin ');
  User.findOne({username: req.auth.username})
    .then(user => {
      if(!user) next({statusCode: 403, message: 'Forbidden'});
      user.comparePassword(req.auth.password)
      .then(user => res.send(user.generateToken()))
      .catch(err => next({statusCode: 403, message: 'Unsuccessful Authentication hjkgjkugyu'}));
    }).catch(next);
});

authRouter.get('/showMyAccount', bearerAuthentication, (req, res, next) => {
  User.findOne({_id: req.userId})
    .then(user => { res.send(`${user.username} has Billions of Dollars`);
    })
    .catch(next);
});
