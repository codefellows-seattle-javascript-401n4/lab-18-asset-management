'use strict';

const {Router} = require('express');
const multer = require('multer');
const httpErrors = require('http-errors');
const s3 = require('../lib/s3.js');
const cellLineDef = require('../models/cellLineDef.js');
const bearerAuth = require('../lib/bearer-auth.js');
const userHandler = require('../routes/user-auth-middleware');
const upload = multer({dest: `${__dirname}/../temp`});

module.exports = new Router()
  .post('/aics-cell-line-def', bearerAuth, userHandler.getUserById, upload.any(), (req, res, next) => {
  // req.body and req.files
    if(!req.account)
      return next(httpErrors(401, '__REQUEST_ERROR__ no account found'));
    if(!req.body.title || req.files.length > 1 || req.files[0].fieldname !== 'sample')
      return next(httpErrors(400, '__REQUEST_ERROR__ title or sample was not provided'));

    let file = req.files[0];
    console.log(file);

    let key = `${file.filename}.${file.originalname}`;
    return s3.upload(file.path, key)
      .then(url => {
        console.log('url', url);
        return new cellLineDef({
          account: req.account._id,
          url,
        }).save();
      })
      .then(cellLineDef => res.json(cellLineDef))
      .catch(next);
    res.sendStatus(418);

  });
