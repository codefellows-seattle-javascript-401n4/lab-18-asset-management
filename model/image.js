'use strict';
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    title:{type: String, required:true},
    url:{type:String, required: true}
})

module.exports = mongoose.model('Image', imageSchema );