'use strict';

const request = require('superagent');
const expect = require('expect');
const Image = require('../models/image');
const mongoose = require('mongoose');

process.env.DB_URL = 'mongodb://localhost:27017/image_dev';
process.env.AWS_BUCKET = 'tre2000';
const PORT = 5500;


beforeAll(() => {
  require('../lib/_server').start(PORT);
  return Image.remove({});  
});

afterAll(() => {
  mongoose.connection.close();
  require('../lib/_server').stop;
});

describe('POST', () => {
  
  let winduImg = '';
  
  test('creates model returns status 200 and ID', () => {
    
    return request
      .post('localhost:5500/image')
      .send({ title:'windu', path:'../asset/windu.jpg' })
      .then(res => {       
        expect(res.status).toEqual(200);
        expect(res.text).not.toBe(undefined);
        winduImg = res.text; 
      // console.log(imgID);     
      });
  });

  test('create a model and returns 200', () => {
    
    return request
      .post(`localhost:5500/image/${winduImg}/new-image`)
      .then(res => {       
        expect(res.status).toEqual(200);
        expect(res.text).toBe('Successful load of image');
      });
  });
});
