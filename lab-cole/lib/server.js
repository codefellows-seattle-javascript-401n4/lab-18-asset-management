'use strict';

const cors = require('cors'); //Do I need to install cors and what do I need it for?
const morgan = require('morgan'); //Do I need to install cors and what do I need it for?
const express = require('express'); //Do I need to install cors and what do I need it for?
const mongoose = require('mongoose'); //Do I need to install cors and what do I need it for?
mongoose.Promise = Promise;

const app = express();
let server = null //Why?
const production = process.env.NODE_ENV === 'production';

//Middleware (do we need these?)
app.use(cors({origin: process.env.CORS_ORIGIN}));
app.use(morgan(production ? 'combined' : 'dev'));

//Routes
app.use(require('../routes/auth-router.js')); 
app.use(require('..routes/sample-router.js')); 
app.use(require('../routes/profile-router.js')); 
app.all('*', (req, res) => res.sendStatus(404));
app.use(require('./error-middleware.js'));//Do I need this?

module.exports = {
    start: () => {
        app.listen(process.env.PORT || 3000, () => {
            console.log('server up');
        });
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_dev', {useMongoClient: true});        
    },
    stop: () => {
        app.close( () => {
            console.log('server down');
        });
        mongoose.disconnect();
    },
};