'use strict'

const request = require('superagent');
const expect = require('expect');
const Image = require('../model/image');

process.env.DB_URL = 'mongodb://localhost:27017/fileUpload_stg';
process.env.AWS_BUCKET = 'paulamookerjee';
const PORT = 4000;
const HOST = 'http://localhost';
const API = 'api/1.0';


beforeAll(() => {
  require('../lib/_server').start(PORT);
  return Image.remove({});  
});

afterAll(() => {
  mongoose.connection.close();
  require('../lib/_server').stop;
});

describe('POST', () => {
  
  let imgID = '';
  
  test('creating a new image model returns an ID and a 200', () => {
    
    return request
    .post(`${HOST}:${PORT}/${API}/image`)
    .send({ name:'MJ', path:'../model/files/MJ_and_the_devil.jpg' })
    .then(res => {       
      expect(res.status).toEqual(200);
      expect(res.text).not.toBe(undefined);
      imgID = res.text;      
    })
  });

  test('creating a new image model returns an ID and a 200', () => {

    return request
    .post(`${HOST}:${PORT}/${API}/image/${imgID}/new-image`)
    .field('title', 'mj')
    .set({'Content-Type':'multipart/form-data'})
    .attach('photo', `${__dirname}/../model/files/MJ_and_the_devil.jpg`)
    .then(res => {       
      expect(res.status).toEqual(200);
      expect(res.text).not.toBe(undefined);
    })
  });
});
    