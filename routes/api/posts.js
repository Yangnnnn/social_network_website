/*jshint esversion: 8 */
const express = require("express");
const router = express.Router();

// @router GET api/posts
// @access Public
router.get("/",function(req,res){
  res.send("posts router");
});



module.exports=router;
