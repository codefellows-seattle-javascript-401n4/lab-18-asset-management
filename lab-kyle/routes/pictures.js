'use strict';

const debug = require('debug')('BEAR:route-pictures');

const Pictures = require('../model/pictures');
const errorHandler = require('../lib/error-handler');
const bearerAuth = require('../lib/middleware/bearer-auth');

module.exports = function(router) {
  router.post('/api/pictures', bearerAuth, (req, res) => {
    debug('POST /api/pictures');

    req.body.userId = req.user._id;

    return new Pictures(req.body).save()
      .then(pictures => res.status(201).json(pictures))
      .catch(err => errorHandler(err, req, res));
  });

  // need to use bearerAuth in all of the other commands

  router.get('/api/pictures/:_id', bearerAuth, (req, res) => {
    debug('GET /api/pictures/:_id');

    return Pictures.findById(req.params._id)
      .then(pictures => res.json(pictures))
      .catch(err => errorHandler(err, req, res));
  });

  router.get('/api/pictures', bearerAuth, (req, res) => {
    debug('GETALL /api/pictures');

    return Pictures.find()
      .then(pictures => res.json(pictures.map(pictures => pictures._id)))
      .catch(err => errorHandler(err, req, res));
  });
  // need to finish
  router.put('/api/pictures', bearerAuth, (req, res) => {
    debug('PUT /api/pictures');

    Pictures.findByIdAndUpdate(req.params._id, req.body, { upsert:true, runValidators:true})
      .then(() => res.sendStatus(204))
      .catch(err => errorHandler(err, req, res));
  });

  router.delete('/api/pictures/:_id', bearerAuth, (req, res) => {
    debug('DELETE /api/pictures');

    return Pictures.findByIdAndRemove(req.params._id)
      .then(() => res.sendStatus(204))
      .catch(err => errorHandler(err, req, res));
  });
};
