'use strict';

const Router = require('express');//need to install
const jsonParser = require('body-parser').json();//need to install, I think
const httpErrors = require('http-errors')//need to install

const account = require('../model/account.js');
const basicAuth = require('../lib/basic-auth-middleware.js');

module.exports = new Router()
.post('/signup', jsonParser, (req, res, next) => {
    //code to check if username and password have been entered
    account.create(req.body)
    .then(user => user.tokenCreate())
    .then(token => res.json({token}))
    .catch(next)
})
.get('/signin', basicHTTP, (req, res, next) => {
    //code to check if account exists
    req.account.tokenCreate()
    .then(token => res.json({token}))
    .catch(next)
})
.put('/update', (req, res, next) => {
    //code to update account
})
.delete('/delete', (req, res, next) => {
    //code to delete account
})