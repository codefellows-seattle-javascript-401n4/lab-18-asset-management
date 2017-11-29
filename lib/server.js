'use strict';
const authRouter = require(__dirname + '/../routes/auth-router');
const cors = require('cors');
const morgan = require('morgan');
const cellLineDefRouter = require(__dirname + '/../routes/aicsCellLineDef');
// const userRouter = require(__dirname + '/../user/user-routes');

const app = module.exports = require('express')();
const production = process.env.NODE_ENV === 'production';
let server = null;

// global middleware
app.use(cors({origin: process.env.CORS_ORIGIN}));
app.use(morgan(production ? 'combined' : 'dev'));

//routes
app.use('/api/v1', cellLineDefRouter);
app.use(authRouter);
// app.use('/api/v1', userRouter);

app.use((err, req, res, next) => {
  console.log(err.statusCode, err.message);
  let status = err.statusCode || 400;
  let message = err.message || 'oh no server error';
  res.status(status).send(message);
  next();
});

module.exports = {
  start: (port) => {
    return new Promise((resolve, reject) => {
      if(server) {
        return reject(new Error('__SERVER_ERROR__ server is allready running'));
      }
      server = app.listen(port, () => {
        console.log('__SERVER_ON__', port);
        return resolve();
      });
    });
  },
  stop: () => {
    return new Promise((resolve, reject) => {
      if(!server)
        return reject(new Error('__SERVER_ERROR__ server is allready off'));
      server.close(() => {
        server = null;
        console.log('__SERVER_OFF__');
        return resolve();
      });
    });
  },
};
