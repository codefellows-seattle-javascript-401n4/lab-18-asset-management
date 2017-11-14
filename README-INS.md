
RUNNING IN DIFFERENT TERMINALS:
//serve up mongodb in another terminal
mkdir db
mongod --dbpath=./db

//start server in one terminal
nodemon server.js  

//run the Tests in another terminal
npm test

//to open the mongo console in a different terminal
mongo

//to create a user or to sign up, run this command in another terminal
_$ echo '{"username": "some-stuff", "password": "whatever", "email":"this@that.com"}' | http post localhost:3000/signup_

//to signin a user, run this command in the terminal
http :3000/signin -a Key:value
