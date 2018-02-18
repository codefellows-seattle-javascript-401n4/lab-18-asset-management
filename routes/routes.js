const express = require('express');
require("dotenv").config();
const fs = require('fs');
const Router = module.exports = express.Router();

var multer  = require('multer');
const uploadDirectory = `${__dirname}/../uploads/`;

var upload = multer({ dest: uploadDirectory });

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

Router.post('/resource', upload.single(`lab18file`) ,(req, res, next) => {
    const base64data = new Buffer(req.file.destination, 'binary');
    fs.readFile(`${__dirname}/../uploads/${req.file.filename}`, (err, data) => {
        if (err) {
            console.log('error: ',err);
            next();
        }

        const base64data = new Buffer(data, 'binary');
        var params = {
            Bucket: process.env.S3_BUCKET,
            Key: req.file.originalname,
            Body: base64data
        };

        s3.upload(params, (err, data) => {
            if (err) {
                res.status(400).send("What did you do?");
                next();
            }
            data.message = "Upload Complete."
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));

            next();
        });
    });

});
