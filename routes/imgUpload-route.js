'use strict';

const jsonParser = require('body-parser').json();
const Image = require(__dirname + '/../model/image');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new aws.S3({ params: {Bucket: 'paulamookerjee'} });

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const upload = multer({

   storage: multerS3({
       s3: s3,
       bucket: 'paulamookerjee',
       contentType: multerS3.AUTO_CONTENT_TYPE,       
       metadata: (req, file, cb ) => {
        cb(null, { fieldName: file.fieldname});
       },
       key: (req, file, cb) => {
        console.log('file is ', file)
        cb(null, Date.now().toString())
       }
   })
})

const imgRouter = module.exports = require('express').Router();

imgRouter.post('/image', jsonParser, (req, res, next) => {

    if(!req.body.path) return next(400);

    let image = new Image(req.body);
    image.save() 
     .then(img => {
        if(img){ 
            res.send(200, img._id);
        } else { next(400)}
     })
     .catch(500);

});

imgRouter.post('/image/:id/new-image', upload.single('photo'), (req, res, next) => {
     
    if(req.params.id === null) return next(400);
    Image.findOne({_id: req.params.id})
     .then(img => {
        var data = { Key: img.name, Body: img.path };
        s3.putObject(data, function(err, data){
            if (err) console.log('Error uploading data: ', data); 
            else res.send('Succesfully uploaded the image!'); 
        });
     })
     .catch(console.log(err))
});
