'use strict';
const fs = require('fs-extra');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: "AKIAJJCMRIDMVQH4A2RQ",
    secretAccessKey: "zd891NhsnZwRkhD7K35JXhIK6jADqCDwHxNJ9XbQ",
    // "region": "sa-east-1"   <- If you want send something to your bucket, you need take off this settings, because the S3 are global. 
});
const s3 = new AWS.S3()

const upload = module.exports = function(path, key){
    
    //  let readStream = fs.createReadStream(path);
    //  readStream.on('open', function () {
    //     readStream.pipe(res);
    //   });
    let params = {Bucket: process.env.AWS_BUCKET, Key: key, ACL: 'public-read', Body:fs.createReadStream(path)}
    console.log('in s3 upload, params: ', params);
    return s3.upload(params, function(err, data){
        console.log(err, data)
    })
}
