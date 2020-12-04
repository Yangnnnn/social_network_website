/*jshint esversion: 8 */
const express = require("express");
const router = express.Router();

// @router GET api/auth
// @access Public
router.get("/",function(req,res){
  res.send("autl router");
});



module.exports=router;
