/*jshint esversion: 8 */
const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require("../../models/userModel");
const bcrypt =require("bcryptjs");
const gravatar =require("gravatar");
const jwt = require("jsonwebtoken");
const config = require("config");
// @router POST api/users
// @access Public
// @desc
router.post("/",body('name').not().isEmpty().withMessage('Name is required'),
body("email").isEmail().withMessage("Please enter a valid Email"),
body("password").isLength({min:8}).withMessage("Password must be at least 6 characters long"),
async function(req,res){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }

  try{
    // check is user exists
    let user = await User.findOne({email:req.body.email});
    if (user){
      return res.status(400).json({errors:[{msg:"User already exists"}]});
    }
      const avatar = gravatar.url(req.body.email,{
        s:"200",
        r:"pg",
        d:"m"
      });

      user = new User({
        name:req.body.name,
        email:req.body.email,
        avatar:avatar,
        password:req.body.password
      });
      const salt = await bcrypt.genSalt(10);
      user.password =await bcrypt.hash(user.password,salt);
      await user.save();
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



// return jsonwebtoken

module.exports=router;
