'use strict';
const faker = require('faker');

// mock env
process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.CORS_ORIGIN = 'http://localhost:8080';
process.env.IMAGECLOUD_SECRET = 'secretpic';
process.env.AWS_BUCKET='darrylcloud';
process.env.AWS_ACCESS_KEY_ID='AKIAJT5YPMXKZDJNG5SA';
process.env.AWS_SECRET_ACCESS_KEY='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';
