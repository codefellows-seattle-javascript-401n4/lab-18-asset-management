'use strict';

const Image = require('../models/image.js');
// const express = require('express');
const multer = require('multer');
// const fs = require('fs-extra');
const aws = require('aws-sdk');
const dotenv = require('dotenv').config();
const jsonParser = require('body-parser').json();
const multerS3 = require('multer-s3');
const s3 = new aws.S3();


const imageRouter = module.exports = require('express').Router();

aws.config.update({
  accessKeyId : process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


let upload = multer({
  storage: multerS3({
    s3:s3,
    bucket: process.env.AWS_BUCKET,
    key: function(req, file, cb){
      console.log('file ', file);
      cb(null, file.originalname);
    },
  }),
});

imageRouter.post('/image', jsonParser, (req, res, next) => {
  new Image(req.body).save()
    .then( img => res.send({statusCode:200, message: img._id}))
    .catch( err => next(err));
});

imageRouter.post('/image/:id/new-image', upload.single('windu'), (req, res, next) => {
  if(req.params.id === null){
    res.send({statusCode: 404, message: 'Not Found'});
  }
  Image.findOne({_id: req.params.id})
    .then( img => {
      let params = {Bucket: process.env.AWS_BUCKET, Key: 'key', Body: img.path};
      s3.putObject(params, function(err, data){
        if(err) console.log(err);
        else res.send('Successful upload of image');
      });
    })
    .catch(err => next(err));
});