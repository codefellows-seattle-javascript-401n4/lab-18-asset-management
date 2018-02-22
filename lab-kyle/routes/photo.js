'use strict';

const debug = require('debug')('Image:route-photo');

const multer = require('multer');
const tempDir = `${__dirname}/../temp`;
const Photo = require('../model/photo');
const upload = multer({ dest: tempDir });
const errorHandler = require('../lib/middleware/error-handler');
const bearerAuth = require('../lib/middleware/bearer-auth');

var aws = require('aws-sdk');
const s3 = new aws.S3();

module.exports = function(router) {
  router.post('/api/photo', bearerAuth, upload.single('image'), (req, res) => {
    debug('POST /api/photo');

    console.log(req.file);

    return Photo.upload(req)
      .then(photoData => new Photo(photoData).save())
      .then(photo => res.json(photo))
      .catch(err => errorHandler(err, req, res));
  });
  router.get('/api/photo/:_id', bearerAuth, (req, res) => {

    return Photo.findById(req.params._id)
      .then(photo => res.json(photo))
      .catch(err => errorHandler(err, req, res));
  });
  router.get('/api/photo', bearerAuth, (req, res) => {
    return Photo.find()
      .then(photos => res.json(photos.map(photo => photo._id)));
  });

  router.put('/api/photo/:_id', bearerAuth, upload.single('image'), (req, res) => {

    return Photo.findById(req.params._id)
      .then(photo => {
        if(photo.userId.toString() === req.user._id.toString()) {
          photo.name = req.body.name || photo.name;
          photo.desc = req.body.desc || photo.desc;
          return photo.save();
        }
        errorHandler(new Error('authorization failed; user does not own pictures, and cannot update'), req, res);
      })
      .then(() => res.sendStatus(204))
      .catch(err => errorHandler(err, req, res));

  });
  router.delete('/api/photo/:_id', bearerAuth, (req, res) => {

    return Photo.findById(req.params._id)
      .then(photo => {
        var params = {
          Bucket: `${process.env.AWS_BUCKET}`,
          Delete: {
            Objects: [
              {
                Key: `${photo.objectKey}`,
              },
            ],
          },
        };

        s3.deleteObjects(params, function(err, data) {
          if (err) console.log(err, err.stack);
          else     console.log(data);
        });
        if(photo.userId.toString() === req.user._id.toString()) return photo.remove();
        errorHandler(new Error('authorization failed; user does not own photo, and cannot delete'), req, res);
      })
      .then(() => res.sendStatus(204))
      .catch(err => errorHandler(err, req, res));
  });


};
