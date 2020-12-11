const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    text:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    likes:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:"user"
            }
        }
    ],
    comments:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:"user"
            },
            text:{
                type:String,
                required:true
            },
            name:{
                type:String
            },
            avatar:{
                type:String
            },
            date:{
                type:Date,
                default:Date.now
            }

        }
    ],
    date:{
        type:Date,
        default:Date.now
    }
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post ;