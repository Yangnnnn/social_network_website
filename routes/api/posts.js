/*jshint esversion: 8 */
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { body, validationResult } = require('express-validator');
const User = require("../../models/userModel")
const Post = require("../../models/posts")
const Profile = require("../../models/profileModel");
const { post } = require("request");

// @router POST api/posts
// @desc post a new post
// @access Private  // need login to post
router.post("/",[auth,[body("text").not().isEmpty().withMessage("Text is required")]],
async function(req,res){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  try {
    
    const user = await User.findById(req.user.id).select('-password');
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user:req.user.id
    })
    const post = await newPost.save();
    res.json(post);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @router GET api/posts
// @desc Get all posts
// @access Private  // need login to see post
router.get("/",auth,async function(req,res){
  try {
    const posts = await Post.find().sort({date:-1}); //most recent first
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// @router GET api/posts/:post_id
// @desc Get the post by id
// @access Private  // need login to see post
router.get("/:post_id",auth,async function(req,res){
  try {
    const post = await Post.findById(req.params.post_id); 
    if (!post){
      return res.status(404).json({msg:"Post not found"});
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind==="ObjectId"){
      return res.status(404).json({msg:"Post not found"});
    }
    res.status(500).send("Server error");
  }
});

// @router DELETE api/posts/:post_id
// @desc Delete the post by id
// @access Private  // need login to see post
router.delete('/:post_id',auth,async function(req,res){
  
  try {
    const post = await Post.findById(req.params.post_id);
    if(post.user.toString() !==req.user.id){
      return res.status(401).send("Not authorized");
    }
    post.remove();
    res.json({msg:"Post removed"});

  } catch (err) {
    console.error(err.message);
    if (err.kind==="ObjectId"){
      return res.status(404).json({msg:"Post not found"});
    }
    res.status(500).send("Server error");
  }
});

// @router PUT api/posts/like/:post_id
// @desc Like a post
// @access Private  // need login to like a post
router.put("/like/:post_id",auth,async function (req,res){
  try {
    const post = await Post.findById(req.params.post_id);
    const temp = post.likes.filter(function(like){
      return like.user.toString()===req.user.id;
    })
    if (temp.length>0)
    {
      return res.status(400).json({msg:"Post already liked"});
    }
    post.likes.unshift({user:req.user.id});
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
})

// @router PUT api/posts/unlike/:post_id
// @desc Unlike a post
// @access Private  // need login to unlike a post
router.put("/unlike/:post_id",auth,async function (req,res){
  try {
    const post = await Post.findById(req.params.post_id);
    const temp = post.likes.filter(function(like){
      return like.user.toString()===req.user.id;
    })
    if (temp.length===0)
    {
      return res.status(400).json({msg:"You haven't liked it yet"});
    }
    const remove_index = post.likes.map(item=>item.user.toString()).indexOf(req.user.id);

    post.likes.splice(remove_index,1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
})

// @router PUT api/posts/comment/:post_id
// @desc comment a post
// @access Private  // need login to comment a post
router.put("/comment/:post_id",[auth,[body("text").not().isEmpty().withMessage("Text is required")]],async function (req,res){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  
  try {
    const post = await Post.findById(req.params.post_id);
    const user = await User.findById(req.user.id).select("-password");
    const comment = {
      user:req.user.id,
      text:req.body.text,
      name:user.name,
      avatar:user.avatar,
    };
    post.comments.unshift(comment);
    await post.save();
    res.json(post.comments);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
})

// @router Delete api/posts/comment/:post_id/:comment_id
// @desc Delete a comment
// @access Private  // need login to delete a post
router.put("/comment/:post_id/:comment_id",auth,async function (req,res){
  try {
    const post = await Post.findById(req.params.post_id);
    const comment = post.comments.find(function(comment){
      if (comment.id===req.params.comment_id){
        return comment;
      
      }
    })
    
    if (!comment){
      return res.status(404).json({msg:"Comment not found"});
    }

    if(comment.user.toString()!==req.user.id){
      return res.status(401).json({msg:"Not authorized"});
    }
    
    // comment_index = post.comments.map(item=>item.id).indexOf(req.params.comment_id);
    // post.comments.splice(comment_index,1);
    post.comments = post.comments.filter(item=>item.id!==req.params.comment_id);



    await post.save();
    res.json(post.comments);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
})





module.exports=router;
