'use strict';
require('dotenv').config();
const PORT = 8000;
const Image = require('../model/image');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);
const expect = require('expect');
const superagent = require('superagent');
const app = module.exports = require('express')();

let objectID;

app.use(require('../routes/routes'));


app.all('*', (req, res, next) => {
    next({statusCode:404, message:'route not found'});
   })
   
app.use((err, req, res, next ) => {
    console.log(err);
    res.status(err.statusCode||500).send(err.message||'server error')
})

beforeAll(()=>{
    app.listen(PORT);
    return  Image.remove({})
})

afterAll(()=>{
    app.close();
})

describe('POST to /api/upload', ()=>{
    it('should return 200 and post object to the local db', ()=>{
        return superagent
        .post(`localhost:${PORT}/api/upload`)
        .set({"Content-Type":"application/json"})
        .send({"title":"still life", "url":"/Users/irynamaslova/Projects/401/lab-18-asset-management/images/CF - still life.JPG"})
        .then(res=>{
            expect(res.statusCode).toEqual(200);
            expect(res.body).not.toBe(null);
            objectID = res.body;
            // console.log('objectID ', objectID )
        })
        .catch()
    })
})

describe(`POST to /api/amazon/:id`, ()=>{
    it('should return a 200 and the posted object', ()=>{
        return superagent
        .post(`localhost:${PORT}/api/amazon/${objectID}`)
        .then(res=>{
            expect(res.statusCode).toEqual(200);
            expect(res.text).toBe('upload successful')
        })
    })
})