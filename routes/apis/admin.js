const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwtAdmin = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/adminRegister');
const validateLoginInput = require('../../validation/adminLog');



//Load Admin model
const Admin = require('../../models/Admin');
// Load User model
const User = require('../../models/User');
//Loa profile model
const Post =require('../../models/Post');



// @route   GET api/admins/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: 'Profile Works'
}));


// @route   Post api/admins/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
        const {
            errors,
            isValid
        } = validateRegisterInput(req.body);
 
        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

    Admin.findOne({
        name: req.body.name
    }).then(admin => {
        if (admin) {
            errors.name = 'name already exists';
            return res.status(400).json(errors);
        } else {

            const newAdmin = new Admin({
                name: req.body.name,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                    if (err) throw err;
                    newAdmin.password = hash;
                    newAdmin
                        .save()
                        .then(admin => res.json(admin))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route   GET api/admins/login
// @desc    Login Admin / Returning jwtAdmin Token
// @access  Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const name = req.body.name;
    const password = req.body.password;

    // Find admin by name
    Admin.findOne({ name }).then(admin => {
        // Check for user
        if (!admin) {
            errors.name = 'admin not found';
            return res.status(404).json(errors); 
        }

      // Check Password
      bcrypt.compare(password, admin.password).then(isMatch => {
      if (isMatch) {
      // admin Matched
      const payload = {
          id: admin.id,
          name: admin.name
      }; // Create jwtAdmin Payload

      // Sign Token
      jwtAdmin.sign(
          payload,
          keys.secretOrKey, {
              expiresIn: 3600 
          },
          (err, token) => {
              res.json({
                  success: true,
                  token: 'Bearer ' + token
              });
          }
      );
      } else {
      errors.password = 'Password incorrect';
      return res.status(400).json(errors);
      }
      });
      });
      });
// @route   GET api/admins/post
// @desc    Login Admin / Returning all post that needs verification
// @access  Private
router.get('/post', passport.authenticate('admin', {
            session: false
        }), (req, res) => {
Post.findOne({
    verified:true
})
.sort({
        date: -1
    })
.then(posts =>{
     if (!posts) {
         return res.status(404).json('There is no prost to be verifiied');
     }
     res.json(posts);
})

})

// @route   GET api/admins/post
// @desc    Login Admin / Returning the posts that  need verification and verify them
// @access  Private
router.put('/post/:id',passport.authenticate('admin', { session: false }),(req,res)=>{
    Post.findById(req.params.id)
    .then(post=>{
    if (post.verified){
        post.verified= true
        post.video= post.tempvid
        post.tempvid=''
        
    }
    res.json(post);
    
})
 .catch(err =>
         res.status(404).json({
             nopostfound: 'No post found with that ID'
         })
 )
})
module.exports =router;