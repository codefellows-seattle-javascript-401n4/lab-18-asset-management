'use strict';
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const DB = process.env.DB_URL || 'mongodb://localhost:27017/visual_files_dev';

const mongoose = require('./lib/mongooseDB');

const server = require(__dirname + '/lib/server.js');

server.start(PORT).then(() => {
  mongoose.connect(DB, {useMongoClient: true});
});
