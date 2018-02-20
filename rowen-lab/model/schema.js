'use strict';

const mongoose = require('mongoose');

const ImageSchema = mongoose.schema({
  url:{type: String, required: true},
  owner: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('image', ImageSchema);
