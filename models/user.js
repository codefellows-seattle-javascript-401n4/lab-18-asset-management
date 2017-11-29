'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');

const userSchema  = mongoose.Schema({
  passwordHash: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  tokenSeed: {type: String, required: true, unique: true},
  created: {type: Date, default: () => new Date()},
});

// instance methods
// used for login
userSchema.methods.verifyPassword = function(password){
  return bcrypt.compare(password, this.passwordHash)
    .then(correctPassword => {
      if(!correctPassword)
        throw httpErrors(401, '__AUTH_ERROR__ incorrect password');

      return this;
    });
};

userSchema.methods.createToken = function(){
  this.tokenSeed = crypto.randomBytes(64).toString('hex');
  return this.save()
    .then(user => {
      return jwt.sign({tokenSeed: user.tokenSeed}, process.env.IMAGECLOUD_SECRET);
    });
};

const User = module.exports = mongoose.model('User', userSchema);

// data is going to contain {username, email, and password}
User.create = function(data){
  // data = {...data}
  // hash password
  let {password} = data;
  delete data.password;
  return bcrypt.hash(password, 8)
    .then(passwordHash => {
      data.passwordHash = passwordHash;
      // genorate a tokenSeed
      data.tokenSeed = crypto.randomBytes(64).toString('hex');
      // create an User
      // save the user
      return new User(data).save();
    });
};
