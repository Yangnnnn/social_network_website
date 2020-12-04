/*jshint esversion: 8 */
const express = require("express");
const router = express.Router();

// @router GET api/users
// @access Public
router.get("/",function(req,res){
  res.send("user router");
});



module.exports=router;
