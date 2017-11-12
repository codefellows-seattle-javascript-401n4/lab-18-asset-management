'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/images_prod', {useMongoClient: true});

const app = module.exports = require('express')();

app.use('/api/1.0', require(__dirname + '/../routes/imgUpload-route'));

app.all('*', (req, res, next) => {

  next(404);

});

app.use((err, req, res, next) => {

   res.send(err);

});


module.exports = {
  start: (port, cb) => {
    app.listen(port, cb);
    console.log(`Server is up on PORT ${process.env.PORT}!`);
  },
  stop: (cb) => app.close(cb),
};
