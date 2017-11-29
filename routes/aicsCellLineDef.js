'use strict';

const {Router} = require('express');
const multer = require('multer');
const s3 = require('../lib/s3.js');
const cellLineDef = require('../models/cellLineDef.js');
const bearerAuth = require('../lib/bearer-auth.js');
const userHandler = require('../routes/user-auth-middleware');
const upload = multer({dest: `${__dirname}/../temp`});

module.exports = new Router()
  .post('/aics-cell-line-def',
    bearerAuth,
    userHandler.getUserById,
    upload.any(), (req, res, next) => {

      let file = req.files[0];
      console.log('file:', file);

      let key = `${file.filename}.${file.originalname}`;
      return s3.upload(file.path, key)
        .then(url => {
          console.log('url', url);
          return new cellLineDef({
            account: req.user._id,
            url,
          }).save();
        })
        .then(cellLineDef => res.json(cellLineDef))
        .catch(next);
    });
