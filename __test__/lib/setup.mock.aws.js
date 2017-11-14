'use strict'
const faker = require('faker');
const awsSDKMock = require('aws-sdk-mock');

// mock env
process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.CORS_ORIGIN = 'http://localhost:8080';
process.env.IMAGECLOUD_SECRET = 'secretpic';
process.env.AWS_BUCKET='darrylcloud';
process.env.AWS_ACCESS_KEY_ID='AKIAJT5YPMXKZDJNG5SA';
process.env.AWS_SECRET_ACCESS_KEY='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';

awsSDKMock.mock('S3', 'upload', (params, callback) => {
  if(!params.Key || !params.Bucket || !params.Body || !params.ACL)
    return callback(new Error('__AWS_USAGE_ERROR__ key bucket acl and body required'));
  if(params.ACL !== 'public-read')
    return callback(new Error('__AWS_USAGE_ERROR__ ACL must be public-read '));
  if(params.AWS_BUCKET !== process.env.BUCKET)
    return callback(new Error('__AWS_USAGE_ERROR__ wrong bucket'));

  callback(null, {Location: faker.internet.url()});
});

awsSDKMock.mock('S3', 'deleteObject', (params, callback) => {
  if(!params.Key || !params.Bucket )
    return callback(new Error('__AWS_USAGE_ERROR__ key bucket required'));
  if(params.AWS_BUCKET !== process.env.BUCKET)
    return callback(new Error('__AWS_USAGE_ERROR__ wrong bucket'));
  callback(null, {});
});
