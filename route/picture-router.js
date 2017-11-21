'use strict';


const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const Picture = require('../model/picture.js');
const jsonParser = require('body-parser').json();
const s3 = new aws.S3();
const pictureRouter = module.exports = require('express').Router();
console.log(process.env.AWS_BUCKET);

aws.config.update({
  accessKeyId : process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

//multer s3 docs
let upload = multer({
  storage: multerS3({
    s3:s3,
    bucket: process.env.AWS_BUCKET,
    key: function(req, file, cb){
      console.log('file ', file);

      cb(null, file.fieldname);
    },
  }),
});

pictureRouter.post('/picture', jsonParser, (req, res, next) => {
  console.log('goes here');
  // if(req.body === null){
  //   res.send({statusCode:404, message: 'not found'});
  // }
  new Picture(req.body).save()
    .then( pic => res.send({statusCode:200, message: pic._id}))
    .catch( err => next(err));
});

pictureRouter.post('/picture/:id/awsPic', upload.single('pic'), (req, res, next) => {
  if(req.params.id === null){
    res.send({statusCode: 404, message: 'Not Found'});
  }
  Picture.findOne({_id: req.params.id})
    .then( picture => {
      let params = {Bucket: process.env.AWS_BUCKET, Key: 'key', Body: picture.path};
      s3.putObject(params, function(err, data){
        if(err) console.log(err);
        else res.send('Picture uploaded to AWS');
      });
    })
    .catch(err => next(err));
});
