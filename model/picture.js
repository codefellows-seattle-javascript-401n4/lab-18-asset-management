'use strict';

const mongoose = require('mongoose');

const pictureSchema = mongoose.Schema({
  title: {type: String, required: true},
  url: {type: String, required: true},
});
console.log('goes here in pic router');

module.exports = mongoose.model('picture', pictureSchema);
