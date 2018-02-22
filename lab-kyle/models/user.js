'use strict';
const debug = require('debug')('basicA:UserSchema');

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const UserSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  findHash: {type: String, required: true},
});

UserSchema.methods.generatePassHash= function(password){
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if(err) return reject(err);
      this.password = hash;
      resolve(this);
    });
  });
};

UserSchema.methods.comparePassHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(err);
      if(!valid) return reject(new Error('authorization failed, password did not match'));
      resolve(this);
    });
  });
};

UserSchema.methods.generateFindHash = function() {
  return new Promise((resolve, reject) => {
    let tries = 0;
    _generateFindHash.call(this);

    function _generateFindHash() {
      this.findhash = crypto.randomBytes(32).toString('hex');
      this.save()
        .then(() => resolve(this.findhash))
        .catch(err => {
          if(tries < 3) {
            tries++;
            _generateFindHash.call(this);
          }
          if(err) return reject(err);
        });
    }
  });
};

UserSchema.methods.generateToken = function() {
  return new Promise((resolve, reject) => {
    this.generateFindHash()
      .then(findhash => resolve(jwt.sign({ token: findhash }, process.env.APP_SECRET)))
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
};



module.exports = mongoose.model('user', UserSchema);
