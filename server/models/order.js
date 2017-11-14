'use strict';

const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  item: {type: String, required: true},
  orderedDate: {type: Date, default: Date.now},
  user: {type: mongoose.Schema.Types.ObjectId, ref:'user'},
  store: {type: mongoose.Schema.Types.ObjectId, ref:'store'},
});

module.exports = mongoose.model('Order', orderSchema);
