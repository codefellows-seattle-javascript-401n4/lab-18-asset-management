'use strict';

const superagent = require('superagent');
const mocha = require('mocha');
const expect = require('expect');
const dotenv = require('dotenv').config();
const Image = require('../model/image.js');
const mongoose = require('mongoose');
const server = require('../index.js');
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/18Lab', {useMongoClient: true});



describe('post test', () => {
  it('should return a 200 for creating a resource', () => {
    return superagent.post('http://localhost:3000/image')
    .send({
      title: 'me',
      path: '../model/13320547_304334873231983_610652625344259341_o.jpg',
    })
    .then( res => {
      expect(res.status).toBe(200);
    });
  });
  it('should return successful upload for resource being uploaded', () => {
    return superagent.post('http://localhost:3000/image/5a0a0bb195a3d9b7b81f2120/new-image')
    .then(res => {
      expect(res.text).toBe('Sucessful upload');
    });
  });
  it('should return a 404 for a upload made with an id not found', () => {
    return superagent.post('http://localhost:3000/image//-new-image')
    .catch( res => {
      expect(res.status).toBe(404);
    });
  });
});
