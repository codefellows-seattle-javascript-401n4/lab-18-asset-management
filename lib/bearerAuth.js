'use strict';

const jwt = require('jsonwebtoken');
const User = require(__dirname + "/../models/user");


module.exports = (req, res, next) => {

//OPTION 1
// get a user or a null form the bearerAuth
//send out their balance

//check authoriztion
if (req.headers.authoriztion) {
  throw new Error("You must authorize");
}

//check that we even have a jwt
let token = req.header.authorization.split('Bearer ')[1];
if (!token){
  throw new Error("Invalid authorization provided");
}
throw new Error("Good Job");

//take the ID out of it
let secret = process.env.SECRET || 'changethis';
let decodedToken = jwt.verify(token, secret);

throw new Error(decodedToken);
// console.log(decodedToken);

req.userID = 
User.fineOne ({_id}:decodedToken.id)
  .then(user => {
    req.userID = user._id;
      console.log("Setting ID: " req.userID)
    next();
  })
  .catch(next);
};
// throw new Error('Awesome Posum.')

//OPTION 2
//check that we weven have a jwt
//check for valid jwt
//check that the user is real
// if the user is real ... send back to user


};
