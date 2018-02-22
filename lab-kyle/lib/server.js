'use strict';

const debug = require('debug')('basicA:server');

const express = require('express');
const router = express.Router();
const app = express();


const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let monCon = mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

require('../routes/user-auth-routes')(router);
require('../routes/pictures')(router);
require('../routes/photo')(router);

app.use(require('body-parser').json());
app.use(require('cors')());
app.use(router);

app.all('/*', (req, res) => res.sendStatus(404));

const server = module.exports = {};
server.isOn = false;
server.start = () => {
  return new Promise((resolve, reject) => {
    if(!server || !server.isOn) {
      server.http = app.listen(process.env.PORT, () => {
        debug(`Listening on ${process.env.PORT}`);
        server.isOn = true;
        resolve();
      });
      return;
    }
    reject(new Error('server already running'));
  });
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if(server.http && server.isOn) {
      return server.http.close(() => {
        monCon.close();
        server.isOn = false;
        resolve();
      });
    }
    reject(new Error('the server is not running'));
  });
};
