'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
app.use(require('../routes/routes.js'));

app.use('*', (req,res,next) => {
  res.sendStatus(404);
  next();
});

let http = null;
let isRunning = null;

module.exports = {
  start: (port) => {
    if (isRunning) return 'Server is already running';
    http = app.listen(port, () => {
      isRunning = true;
      console.log(`Server is running in port: ${port}`);
      console.log('Did you run "npm run db" to ensure your mongdb database is running?');
      if(port === 3000) console.log('Did you create an ENV file?.');
    });
  },
  stop: () => {
    if (!isRunning) return'"Server is already shut down';
    if (!http) return 'Invalid Server';
    http.close(() => {
      http = null;
      isRunning = false;
      console.log('Server shut down.');
    });
  };
};
