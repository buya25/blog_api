const mongoose = require("mongoose");
const Post = require("../Post/Post");

//create schema
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "First Name is required"],
    },
    lastname: {
        type: String,
        required: [true, "Second Name is required"],
    },
    profilePhoto: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["Admin", "Guest", "Editor"],
    },
    viewers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    blocked:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    // plan:
    //     {
    //         type: String,
    //         enum: ['Free', 'Basic', 'Premium'],
    //         default: 'Free'
    //     },
    userAward:
        {
            type: String,
            enum: ["Gold","Silver","Bronze"],
            default:"Bronze"
        }
    
},
{
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});

//Hooks
//pre-before record is saved
userSchema.pre("findOne", async function (next){
      //populate the post
  this.populate({
    path: "posts",
  });
    //get the user id
    const userId = this._conditions._id;
    //find the post created by the user
    const posts = await Post.find({user: userId})
    //get the last post created by the user
    const lastPost = posts[posts.length - 1];
    
    //get the post date
    const lastpostDate = new Date(lastPost?.createdAt);
    //get the last post date in string format
    let lastPostDateStr = lastpostDate.toDateString();
    //Add virtuals to schema
    userSchema.virtual("lastpostDate").get(function(){
        return lastPostDateStr; 
    })

    // ------------------------Check if user is inactive for 30days------------------------
    //get current date
    const currentDate = new Date();
    //get the difference between the last post date and the current date
    const diff = currentDate - lastpostDate;
    //get the difference in days and return less than in days
    const diffInDays = diff / (1000 * 3600 * 24);

    if(diffInDays > 30){
        //Add virtuals isInactive to schema to check if a user is in active for 30 days
        userSchema.virtual("isInActive").get(function () {
            return true;
          });

          //Find the user by ID and update
    await User.findByIdAndUpdate(
        userId,
        {
            isBlocked: true,
        },
        {
            new: true,
        }
    )
    }else{
         userSchema.virtual("isInActive").get(function () {
             return false;
           });
           
        //Find the user by ID and update
    await User.findByIdAndUpdate(
        userId,
        {
            isBlocked: false,
        },
        {
            new: true,
        }
    )   
    }
    //---------------Last Active Date------------------
    //convert to days ago, for example 1 day ago
    const daysAgo = Math.floor(diffInDays);
    //add virtual lastActive in days to the schema
    userSchema.virtual("lastActive").get(function(){
        //check if days is less than 0
        if(daysAgo <= 0){
            return 'Today'
        }
        //check if days ago equals to 1
        if(daysAgo === 1) {
            return "Yesterday"
        }
        //check if days ago is greater than one
        if(daysAgo > 1){
            return `${daysAgo} days ago`
        }
    });

    //--------------------------------------------------
    //update userAwards based on the number of posts
    //--------------------------------------------------
    //get the number of posts
    const numberOfPosts = posts.length;
    //check if the posts is less than 10
    if (numberOfPosts < 10) {
        await User .findByIdAndUpdate(
            userId,
            {
                userAward: "Bronze",
            },
            {
                new: true,
            }
        );
    }
    //check if the posts is greater than 10
    if (numberOfPosts > 10) {
        await User .findByIdAndUpdate(
            userId,
            {
                userAward: "Silver",
            },
            {
                new: true,
            }
        );
    }
    //check if the posts is greater than 20
    if (numberOfPosts > 20) {
        await User .findByIdAndUpdate(
            userId,
            {
                userAward: "Gold",
            },
            {
                new: true,
            }
        );
    }    


    next();
});
  
//post after saving
// userSchema.post("save", function (next) {
//     console.log("post hook is called");
// });

//Get fullname
userSchema.virtual("fullname").get(function () {
    return `${this.firstname} ${this.lastname}`;
});

//Get the initials of the user names
userSchema.virtual('initials').get(function() {
    if (!this.firstname || !this.lastname) {
      return "";
    }
  
    return `${this.firstname[0]}${this.lastname[0]};`
  });

//Get Post Count
userSchema.virtual("postCounts").get(function () {
    return this.posts.length;
  });

//Get followers Count
userSchema.virtual("followersCount").get(function () {
    return this.followers.length;
  });

//Get following Count
userSchema.virtual("followingCount").get(function () {
    return this.following.length;
  });

//Get ViewerCount
userSchema.virtual('viewerCount').get(function(){
    return this.viewers.length;
});

//Get BlockCount
userSchema.virtual('blockCount').get(function(){
    return this.blocked.length;
});

//compile user model
const User = mongoose.model('User', userSchema);

module.exports = User;