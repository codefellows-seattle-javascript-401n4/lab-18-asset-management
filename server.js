'use strict';
require('dotenv').config();
const PORT = process.env.PORT||3000;
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const MONGODB_URI = process.env.MONGODB_URI||'mongodb://xfvgf7gysd78fgsydfy78sd7f:dfs87df6sd8fsdf87g6dsf87g7xdfg77dx8fg8@ds159235.mlab.com:59235/irynasimages'
mongoose.connect(MONGODB_URI);
const app = module.exports = require('express')();



app.use(require('./routes/routes'));


app.all('*', (req, res, next) => {
    next({statusCode:404, message:'route not found'});
   })

app.use((err, req, res, next ) => {
    console.log(err);
    res.status(err.statusCode||500).send(err.message||'server error')
})

app.listen(PORT, console.log('server ot port: ', PORT));