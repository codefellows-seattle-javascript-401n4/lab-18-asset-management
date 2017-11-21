'use strict';

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/18Lab', {useMongoClient: true});

const app = require('express')();

app.use(bodyParser.json());
app.use(require(__dirname + '/routes/image-route.js'));
app.use((err,req,res,next) => {
  console.log(err);
  res.status( 500|| err.statusCode).send(err.message || 'server error');
});

app.listen(process.env.PORT || 3000);
