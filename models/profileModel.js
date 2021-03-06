/*jshint esversion: 8 */
const mongoose = require("mongoose");
const { Schema } = mongoose;


const ProfileSchema = new Schema({
    //connect user to profile
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
    },
    company:{
        type:String
    },
    website:{
        type:String
    },
    location:{
        type:String
    },
    // student, developer,etc
    status:{
        type:String,
        required:true
    },
    skills:{
        type:[String],
        required:true
    },
    bio:{
        type:String
    },
    github:{
        type:String
    },
    experience:[
        {
            title:{
                type:String,
                required:true
            },
            company:{
                type:String,
                required:true
            },
            location:{
                type:String
            },
            from:{
                type:Date,
                required:true
            },
            to:{
                type:Date,
                // required:true
            },
            current:{
                type:Boolean,
                default:false
            },
            description:{
                type:String
            }
        }
    ],
    education:[
        {
            school:{
                type:String,
                required:true
            },
            degree:{
                type:String,
                required:true
            },
            fieldofstudy:{
                type:String,
                required:true
            },
            from:{
                type:Date,
                required:true
            },
            to:{
                type:Date,

            },
            current:{
                type:Boolean,
                default:false
            },
            description:{
                type:String
            }

        }
    ],
    social:{
        youtube:{
            type:String
        },
        twitter:{
            type:String
        },
        facebook:{
            type:String
        },
        linkedin:{
            type:String
        },
        instagram:{
            type:String
        }
    },
    date:{
        type:Date,
        default:Date.now
    }

});

const Profile = mongoose.model("Profile",ProfileSchema);
module.exports = Profile;