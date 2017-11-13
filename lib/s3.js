'use strict';

const fs = require('fs-extra');
const aws = require('aws-sdk');
const s3 = new aws.S3();


const upload = (path) => {
  let params = {
    Bucket: process.env.AWS_BUCKET,
    Key: 'key',
    ACL: 'public-read',
    Body: fs.createReadStream(path),
  };
  return s3.upload(params, function(err,data){
    console.log(err,data);
  });
};
