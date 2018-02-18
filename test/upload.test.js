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

test('Upload file to server, parse with multer, and upload to s3.', done => {
       request
       .post(`localhost:${process.env.PORT || 3000}/resource`)
       .attach('lab18file', `${__dirname}/${process.argv[2] || 'ff7.jpg'}`)
       .end((err, res) => {
           expect(res.status).toEqual(200);
           expect(res.body.message).toEqual("Upload Complete.");
           uploadedFileKey = res.body.Key;
        done();
       });
});
