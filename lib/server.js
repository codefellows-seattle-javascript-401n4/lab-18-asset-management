'use strict';

const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const app = express();
let server = null;
// register routes
app.use(require('../route/picture-router.js'));
app.all('*', (req, res) => res.sendStatus(404));
app.use(require('./error-middleware.js'));

module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      if(server)
        return reject(new Error('__SERVER_ERROR__ server is allready running'));
      server = app.listen(process.env.PORT, () => {
        console.log('__SERVER_ON__', process.env.PORT);
        return resolve();
      });
    })
      .then(() => mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/aws_dev', {useMongoClient: true}));
  },
  stop: () => {
    return new Promise((resolve, reject) => {
      if(!server)
        return reject(new Error('__SERVER_ERROR__ server is allready off'));
      server.close(() => {
        server = null;
        console.log('__SERVER_OFF__');
        return resolve();
      });
    })
      .then(() => mongoose.disconnect());
  },
};
