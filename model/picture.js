'use strict';

const mongoose = require('mongoose');

const pictureSchema = mongoose.Schema({
  title: {type: String, required: true},
  url: {type: String, required: true},
  account: {type: mongoose.Schema.Types.ObjectId, required: true},
  created: {type: Date, default: () => new Date},
});

module.exports = mongoose.model('picture', pictureSchema);
