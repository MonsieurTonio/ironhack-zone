const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const uploadCloud = require('../config/cloudinary.js');
const ensureLogin = require("connect-ensure-login");
const User = require('../models/User.js');
const spotifyApi = require('spotify-web-api-node');


/* GET home page */

router.get('/', (req, res, next) => {
  if(!req.user){
    res.render('index') 
} else {
  User.findById(req.user._id,function(err,user){

    if (err) return next(err);

    console.log('user', user)

    res.render('index', {
      user: user
    });
  });
}});


router.get('/profile',  ensureLogin.ensureLoggedIn(), (req, res, next) => {

    User.findById(req.user._id,function(err,user){
    
      if (err) return next(err);

      console.log('user', user)

      res.render('profile', {
        user: user
      });
    })
});

router.post('/profile', ensureLogin.ensureLoggedIn(), uploadCloud.single('photo'), (req, res, next) => {

  User.findById(req.user._id,function(err,user){
    if (err) return next(err);

    if (req.file) {
      user.avatarUrl = req.file.url;
    }

    if (req.body.firstName){
      user.firstName = req.body.firstName;
    }
    if (req.body.lastName){
      user.lastName = req.body.lastName;
    }

    if (req.body.company){
      user.company = req.body.company;
    }

    if (req.body.email){
      user.email = req.body.email;
    } 

    user.save(function(err, user){
      if (err) return next(err);
      res.render('profile', 
      {messageSave: 'You have successfully saved your changes', user:user});
    });


  });
  
});


module.exports = router;
