'use strict';
const fs = require('fs-extra');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.ACCESS_ID_Key||AKIAJJCMRIDMVQH4A2RQ,
    secretAccessKey: process.env.SECRET_ACCESS_Key||zd891NhsnZwRkhD7K35JXhIK6jADqCDwHxNJ9XbQ
    // "region": "sa-east-1"   <- If you want send something to your bucket, you need take off this settings, because the S3 are global. 
});
const s3 = new AWS.S3()

const upload = module.exports = function(path, key){
    let params = {Bucket: process.env.AWS_BUCKET||irynasbucket, Key: key, ACL: 'public-read', Body:fs.createReadStream(path)}
    // console.log('in s3 upload, params: ', params);
    return s3.upload(params, function(err, data){
        console.log('upload callback:', err, data)
    })
}
