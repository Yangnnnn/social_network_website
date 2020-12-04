/*jshint esversion: 8 */
const express = require("express");
const router = express.Router();

// @router GET api/profile
// @access Public
router.get("/",function(req,res){
  res.send("profile router");
});



module.exports=router;
