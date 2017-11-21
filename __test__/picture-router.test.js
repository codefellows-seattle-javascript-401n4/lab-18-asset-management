'use strict';
require('dotenv').config();
// require npm
const request = require('superagent');
const expect = require('expect');
// app modules
const server = require('../lib/server.js');
// test globals
const URL = `http://localhost:${process.env.PORT}`;
const Picture = require('../model/picture');
const mongoose = require('mongoose');



beforeAll(() => {
  require('../lib/server').start(process.env.PORT);
  return Picture.remove({});
});

afterAll(() => {
  mongoose.connection.close();
  require('../lib/server').stop;
});

describe('POST', () => {

  let pic = '';

  test('creates model returns status 200 and ID', () => {

    return request
      .post('localhost:5500/picture')
      .send({ title:'pic', path:'/asset/pic.jpg' })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.text).not.toBe(undefined);
        pic = res.body.message;
        console.log(pic);
      });
  });

  // test('create a model and returns 200', () => {
  //
  //   return request
  //     .post(`localhost:5500/picture/${pic}/new-pic`)
  //     .set({'Content-Type':'multipart/form-data'})
  //     .attach('pic', `${__dirname}/asset/pic.jpg`)
  //     .then(res => {
  //       expect(res.status).toEqual(200);
  //       expect(res.text).toBe('Pic uploaded to AWS!');
  //     });
  // });
});
