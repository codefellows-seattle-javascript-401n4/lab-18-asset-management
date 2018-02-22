'use strict';

const fs = require('fs');
const del = require('del');
const path = require('path');
const mongoose = require('mongoose');
const tempDir = `${__dirname}/../temp`;
const s3UploadProm = require('../lib/middleware/aws-s3');

const Photo = mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  picturesId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'pictures' },
  imageURI: { type: String, required: true, unique: true },
  objectKey: { type: String, required: true, unique: true },
}, { timestamps: true });


Photo.statics.upload = function(req) {
  return new Promise((resolve, reject) => {
    if(!req.file) return reject(new Error('form-data failed; file not present'));
    if(!req.file.filename) return reject(new Error('form-data failed; file path not found'));

    let params = {
      ACL: 'public-read',
      Bucket: process.env.AWS_BUCKET,
      Key: `${req.file.filename}${path.extname(req.file.originalname)}`,
      Body: fs.createReadStream(req.file.path),
    };

    return s3UploadProm(params)
      .then(s3Data => {
        del([`${tempDir}/*`]);

        let photoData = {
          name: req.body.name,
          desc: req.body.desc,
          objectKey: s3Data.Key,
          imageURI: s3Data.Location,
          userId: req.user._id,
          picturesId: req.body.picturesId,
        };
        resolve(photoData);
      })
      .catch(reject);
  });
};

module.exports = mongoose.model('photo', Photo);
