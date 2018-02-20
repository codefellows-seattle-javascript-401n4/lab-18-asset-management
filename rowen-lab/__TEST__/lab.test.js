require("dotenv").config();
const expect = require('expect');
const app = require('../lib/server.js');
const request = require('superagent');
const fs = require('fs');
let uploadedFileKey = '';

beforeAll(done => {
  app.start(process.env.PORT || 3000);
  done();
});

afterAll(done => {
  app.stop();
});

test('Upload to server, parse, upload to a3.', done => {
  request
  .post(`localhost:${process.env.PORT || 3000}/resource`)
  .attach('labfile', `${__dirname}/${process.argv[2] || 'sif.jpg'}`)
  .end((err, res) => {
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual("Upload finished.");
    uploadedFileKey = res.body.Key;
    done();
  });
});
