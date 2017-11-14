'use strict'

const Router = require('express')//need to install
const multer = require('multer')//need to install
const httpErrors = require('http-errors')//need to install

const sample = require('../model/sample.js')
const bearerAuth = require('../lib/bearer-auth-middleware.js')

module.exports = new Router()
.post('/sample', bearerAuth, jsonParser, (req, res, next) => {
    //code to check if account exists
    //need to review the ket sample code demo'd in class...      
    }).save()
    .then(sample => res.json({sample}))
    .catch(next)a