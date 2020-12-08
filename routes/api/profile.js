/*jshint esversion: 8 */
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/profileModel");
const User = require("../../models/userModel");
const { body, validationResult } = require('express-validator');
const { compareSync } = require("bcryptjs");
// @router GET api/profile/me
// @desc Get current user profile
// @access Private
router.get("/me",auth,async function(req,res){
  try{
    const profile = await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']); 
    if(!profile){
      return res.status(400).json({msg:'No profile found'});
    }
    res.json(profile);
  }
  catch(err){
    console.error(err.message);
    res.status(500).send("Server Error")
  }
});

// @router POST api/profile
// @desc Create or updata user profile
// @access Private
router.post("/",[auth,[body("status").not().isEmpty().withMessage("Please enter a valid status"),
body("skills").not().isEmpty().withMessage("Skill is requested")
]],async function(req,res){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }
  const {
    company,
    website,
    location,
    bio,
    github,
    status,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  const profileFields={};
  profileFields.user = req.user.id;
  if(company) profileFields.company = company;
  if(website) profileFields.website = website;
  if(location) profileFields.location = location;
  if(bio) profileFields.bio = bio;
  if(github) profileFields.github = github;
  if(status) profileFields.status = status;
  if(skills){
    profileFields.skills=skills.split(',').map(skill=>skill.trim())
  }
  profileFields.social = {}
  if(youtube) profileFields.social.youtube = youtube;
  if(facebook) profileFields.social.facebook = facebook;
  if(twitter) profileFields.twitter = twitter;
  if(instagram) profileFields.instagram = instagram;
  if(linkedin) profileFields.linkedin = linkedin;
  try{
    let profile = Profile.findOne({user:req.user.id});
    //if we found user ,we update
    if(profile){
     profile = await Profile.findOneAndUpdate({user:req.user.id},
       {$set:profileFields},
       {new:true}
     );
    return res.json(profile);
    
    }
    // no user found create a new one
    profile = new Profile(profileFields);
    await profile.save();
    return res.json(profile);

  }
  catch(err){
    console.error(err.message);
    res.status(500).send("Server Eoor")
  }
});




module.exports=router;
