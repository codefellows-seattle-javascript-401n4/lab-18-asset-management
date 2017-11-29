'use strict';

const mongoose = require('mongoose');

const cellLineDefSchema = mongoose.Schema({
  url: {type: String, required: true},
  account: {type: mongoose.Schema.Types.ObjectId, required: true},
  created: {type: Date, default: () => new Date},
});

module.exports = mongoose.model('cellLineDef', cellLineDefSchema);
