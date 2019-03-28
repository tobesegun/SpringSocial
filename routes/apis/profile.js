const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport= require ('passport');

//load a validation
const validatorProfileInput=  require('../../validation/profile');
 


//Load profile Model
const Profile= require('../../models/Profile');
//load User profile
const User = require('../../models/User');





// @route   DELETE api/profile/Video/:exp_id
// @desc    Delete Video from profile
// @access  Private
router.delete(
    '/experience/:exp_id',
    passport.authenticate('user', {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
                user: req.user.id
            })
            .then(profile => {
                // Get remove index
                const removeIndex = profile.experience
                    .map(item => item.id)
                    .indexOf(req.params.exp_id);

                // Splice out of array
                profile.experience.splice(removeIndex, 1);

                // Save
                profile.save().then(profile => res.json(profile));
            })
            .catch(err => res.status(404).json(err));
    }
);





//@route GET api/profile/test
//@desc Test post route
//@access Public
router.get('/test', (req, res) => res.json({
    msg: "Profile Works"
}));

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
    const errors = {};

    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noprofile = 'There are no profiles';
                return res.status(404).json(errors);
            }

            res.json(profiles);
        })
        .catch(err => res.status(404).json({
            profile: 'There are no profiles'
        }));
});



// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:handle', (req, res) => {
    const errors = {};

    Profile.findOne({
            handle: req.params.handle
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});


//@route GET api/profile
//@desc get current users profile 
//@access Private
router.get('/', passport.authenticate('user',{session: false}), (req,res)=>{
    const errors ={};
    Profile.findOne({user: req.user.id})
    .populate('user',['name','avatar'])
    .then (profile =>{
        if(!profile){
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors);
        }
        res.json(profile);
    })
    .catch(err =>res.status(404).json(err))
});


//@route Post api/profile
//@desc creating user profile 
//@access Private
router.post('/', passport.authenticate('user', {session: false}), (req, res) => {
    const {errors, isValid} = validatorProfileInput(req.body);

    //check validation 
    if(!isValid){
        //return error 
        return res.status(400).json(errors);
    }
    // get Fields
        const profileFields={};
        profileFields.user =req.user.id
        if(req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.website) profileFields.website = req.body.website
        if (req.body.location) profileFields.Location = req.body.location
        if (req.body.status) profileFields.status = req.body.status
        if (req.body.bio) profileFields.bio = req.body.bio

        //social
        profileFields.social={}
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram

        Profile.findOne({ user: req.user.id})
        .then(profile=>{
            if(profile){
                //udpate 
                Profile.findOneAndUpdate(
                    {user:req.user.id},
                    {$set:profileFields},
                    {new: true}
                    )
                    .then(profile => res.json(profile)); 
                
            }else{
                //check if the handle exsists
                Profile.findOne({ handle: profileFields.handle})
                .then(profile=>{
                    if(profile){
                        errors.handle ='That handle already exsist';
                        res.status(400).json(errors)
                    }
                    //save Profile
                    new Profile(profileFields).save().then(profile => res.json(profile));

                });
            }
        })
});
//@route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
    '/',
    passport.authenticate('user', {
        session: false
    }),
    (req, res) => {
        Profile.findOneAndRemove({
            user: req.user.id
        }).then(() => {
            User.findOneAndRemove({
                _id: req.user.id
            }).then(() =>
                res.json({
                    success: true
                })
            );
        });
    }
);


module.exports = router;