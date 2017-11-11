'use strict';

const Image = require(__dirname + '/../model/image');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new aws.S3({});

const upload = multer({

   storage: multerS3({
       s3: s3,
       bucket: 'paulamookerjee',
       metadata: (req, file, cb ) => {
        cb(null, { fieldName: file.fieldname});
       },
       key: (req, file, cb) => {
        cb(null, Date.now().toString())
       }
   })
})

const imgRouter = module.exports = require('express').Router();

imgRouter.post('/image/:id/new-image', upload.array('photos', 3), (req, res, next) => {

    if(req.files.length === 0) return next(400);
    new Image(req.files[0])
    .then(img => img.save())
    .catch(500);

    res.send('Successfully uploaded ' + req.files.length + ' photos!')
    
});