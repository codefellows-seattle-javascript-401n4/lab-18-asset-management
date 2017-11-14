'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const mongodbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_dev';

const app = module.exports = require('express')();

app.use(require(__dirname + '/routes/auth-routes'));
app.use(require(__dirname + '/routes/orders-routes'));
app.all('*', (req, res) => res.sendStatus(404));

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message || 'server error');
});

let server = null;

module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      let port = process.env.port || 3000;

      if(server)
        return reject(new Error('__SERVER_ERROR__server is already running'));
      server = app.listen(port, () => {
        console.log('__SERVER_ON__' + port);
        return resolve();
      });
    })
    .then(() => mongoose.connect(mongodbURI, {useMongoClient: true}));
  },

  stop: () => {
    return new Promise((resolve, reject) => {
      if(!server)
        return reject(new Error('SERVER_ERROR: server is already off'));
      server.close(() => {
        server = null;
        console.log('SERVER OFF');
        return resolve();
      });
    })
    .then(() => mongoose.disconnect());
  },
};
