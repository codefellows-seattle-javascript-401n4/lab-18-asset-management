'use strict';

const Router = require('express');//need to install
const jsonParser = require('body-parser').json();//need to install, I think
const httpErrors = require('http-errors')//need to install

const profile = require('../model/profile.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

module.exports = new Router()
.post('/profile', bearerAuth, jsonParser, (req, res, next) => {
    //code to check if account exists
    return new profile({
        username: req.body.username,
        account: req.body.account,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatar: req.body.avatar,
        bio: req.body.bio,
        email: req.body.email        
    }).save()
    .then(profile => res.json({profile}))
    .catch(next)
})