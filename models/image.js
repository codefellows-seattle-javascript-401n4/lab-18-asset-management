'use strict';
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: {type:String , default: 'windu'},
  path: {type:String, required:true}
});

module.exports = mongoose.model('image', imageSchema);