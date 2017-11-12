'use strict';

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({

    name: { type: String, default: 'Photo' },  
    path: { type: String, required: true },

});

module.exports = mongoose.model('Image', imageSchema);