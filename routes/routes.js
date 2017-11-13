'use strict';
const Image = require('../model/image');
const multer = require('multer');
const s3 = require('../lib/s3');
const bodyParser = require('body-parser').json();
const Router = module.exports = require('express').Router();

const upload = multer({dest: `${__dirname}/../temp`});


Router.post('/api/upload', bodyParser, (req, res, next)=> {
    if(!req.body.title||!req.body.url) return next({statusCode:400, message:"bad request"});
    let image = new Image(req.body);
    image.save()
    .then(image => {
        res.send(image._id)
    })
    .catch(next)
}) 

Router.post(`/api/amazon/:id`, upload.single('CF - still life'), (req, res, next)=>{
  Image.findOne({_id:req.params.id})
  .then(image=>{
      if(!image) return next({statusCode:404, message:"image not found"})
    let key = `Image ${image._id}`
    s3(image.url, key);
    res.send("upload successful")
  })
  .catch (next)
})