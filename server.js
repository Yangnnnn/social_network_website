/*jshint esversion: 6 */
const express = require("express");

const app = express();

const PORT =process.env.PORT||5000;




// get "/"
app.get("/",(req,res)=>{
  res.send("Hi");
});


// listening the PORT
app.listen(PORT,()=>console.log("Port 5000 is listening ")
);
