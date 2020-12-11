/*jshint esversion: 8 */
const express = require("express");
const router = express.Router();
const request = require("request");
const config = require("config");
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
    const profile = await Profile.findOne({user:req.user.id}).populate('User',['name','avatar']); 
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
  profileFields.social = {};
  if(youtube) profileFields.social.youtube = youtube;
  if(facebook) profileFields.social.facebook = facebook;
  if(twitter) profileFields.twitter = twitter;
  if(instagram) profileFields.instagram = instagram;
  if(linkedin) profileFields.linkedin = linkedin;

  try{
    let profile = await Profile.findOne({user:req.user.id});
    console.log(profile);
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

// @router DELETE api/profile
// @desc Delete user profile, user and posts
// @access Private
router.delete("/",auth,async function(req,res){
  try {
    await Profile.findOneAndRemove({user:req.user.id});
    await User.findOneAndRemove({_id:req.user.id});
    res.json({msg:"User deleted"});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @router PUT api/profile/experience
// @desc Add profile experience
// @access Private
router.put("/experience",[auth,[body("title").not().isEmpty().withMessage("Title is required"),
body("company").not().isEmpty().withMessage("Company is required"),body("from").not().isEmpty().withMessage("From Date is required ")]], async function(req,res){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }
  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;
  const exp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }
  try {
    console.log(req.user.id)
    const profile = await Profile.findOne({user:req.user.id});
    console.log(profile)
    profile.experience.unshift(exp);
    await profile.save();
    res.json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @router DELETE api/profile/experience/:exp_id:
// @desc delete profile experience
// @access Private

router.delete("/experience/:exp_id",auth,async function(req,res){
  try {
    const profile = await Profile.findOne({user:req.user.id});
    console.log(profile);
    // get remove index
    const exp_index = profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
    profile.experience.splice(exp_index,1)
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
})


// education part

// @router PUT api/profile/education
// @desc Add profile education
// @access Private
router.put("/education",[auth,[body("degree").not().isEmpty().withMessage("degree is required"),
body("school").not().isEmpty().withMessage("school is required"),
body("fieldofstudy").not().isEmpty().withMessage("fieldofstudyis required "),
body("from").not().isEmpty().withMessage("from date required "), ]],  
async function(req,res){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;
  const edu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }
  try {
    console.log(req.user.id)
    const profile = await Profile.findOne({user:req.user.id});
    console.log(profile)
    profile.education.unshift(edu);
    await profile.save();
    res.json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @router DELETE api/profile/experience/:exp_id:
// @desc delete profile experience
// @access Private

router.delete("/education/:edu_id",auth,async function(req,res){
  try {
    const profile = await Profile.findOne({user:req.user.id});
    console.log(profile);
    // get remove index
    const edu_index = profile.education.map(item=>item.id).indexOf(req.params.edu_id);
    profile.education.splice(edu_index,1)
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
})
// @router GET api/profile/github/:username:
// @desc Get user repos from github
// @access Public
router.get("/github/:username",function(req,res){
  try {
    const options={
      url: "https://api.github.com/users/"+req.params.username+"/repos?per_page=5&sort=created:asc&client_id="+
      config.get("githubClientId")+"&client_secret="+config.get("githubSecret"),
      method:'GET',
      headers:{'user-agent':'node.js'}
    };

    request(options,function(error,response,body){
      if (error){
        console.error(error);
      }
      if(response.statusCode!==200){
        res.status(404).json({msg:'No github profile found'});
      }
      res.json(JSON.parse(body));
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error")
  }
})
module.exports=router;
