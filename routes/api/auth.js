/*jshint esversion: 8 */
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt =require("bcryptjs");
const { body, validationResult } = require('express-validator');
// @router GET api/auth
// @access Public
router.get("/",auth,async function(req,res){
  try{
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  }
  catch(err){
    console.error(err.message);
    res.status(500).send("server error");
  }
});
// @router POST api/auth
// @access Public
// @desc Authentication

router.post("/",body("email").isEmail().withMessage("Please enter a valid Email"),
body("password").exists().withMessage("Password must be at least 6 characters long"),
async function(req,res){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }

  try{
    // check if user exists
    let user = await User.findOne({email:req.body.email});
    if (!user){
      return res.status(400).json({errors:[{msg:"Invalid Credentials"}]});
    }

      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if(!isMatch){
        return res.status(400).json({errors:[{msg:"Invalid Credentials"}]});
      }
      const payload ={
        user:{
          id:user.id
        }
      };
      // for test
      jwt.sign(payload,config.get("jwtSecret"),{expiresIn:360000},function(err,token){
        if(err) throw err;
        res.json({token});
      });
    }


  catch(err){
    console.error(err.message);
    res.status(500).send("Server error");
  }

});

module.exports=router;
