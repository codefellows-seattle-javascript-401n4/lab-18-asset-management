'use strict';
const Image = require('../model/image');
const multer = require('multer');
const s3 = require('../lib/s3');
const bodyParser = require('body-parser').json();
const Router = module.exports = require('express').Router();

const upload = multer({dest: `${__dirname}/../temp`});


Router.post('/api/upload', bodyParser, (req, res, next)=> {
    let image = new Image(req.body);
    // Image.findOne({url:req.url})
    // .then(image => {
    //     if (image) return next({statusCode:400, message:'image exists'});
    // })
    // .catch(next());
    image.save()
    .then(image => {
        res.send(image._id)
    })
    .catch(next)
}) 


Router.post(`/api/amazon/:id`, upload.single('CF - still life'), (req, res, next)=>{
//   if(!req.body) next({statusCode:400, message:'bad request'});
  Image.findOne({_id:req.params.id})
  .then(image=>{
    let key = `Image ${image._id}`
    console.log('in amazon routes, key: ', key);
    return s3(image.url, key)
  })
  .catch (next)
})