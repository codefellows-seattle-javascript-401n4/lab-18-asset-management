'use strict';
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: {type:String,required:true},
  path: {type:String,required:true},
});

module.exports = mongoose.model('image', imageSchema);
