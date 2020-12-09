/*jshint esversion: 8 */
const express = require("express");
const app = express();
const PORT =process.env.PORT||5000;

// Middleware
//body-parser
app.use(express.json({extended:false}));


//mongoDB setup
const mongoose = require("mongoose");
const config =require("config");
const mongoDB=config.get("mongoDBurl");

const connectDB = async()=>{
  try{
    await mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify:false

});
  console.log("connected to the database");
  }
  catch(err){
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

// mongoDB setup End


// get "/"
app.get("/",(req,res)=>{
  res.send("Hi");
});
//routes

app.use("/api/user",require("./routes/api/user"));
app.use("/api/auth",require("./routes/api/auth"));
app.use("/api/posts",require("./routes/api/posts"));
app.use("/api/profile",require("./routes/api/profile"));


// listening the PORT
app.listen(PORT,()=>console.log("Port 5000 is listening ")
);
