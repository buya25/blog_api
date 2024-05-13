const mongoose = require("mongoose");


//create schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Post Title is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Post Description is required"]
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: [true, "Post category is required"]
    },
    numViews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    dislikes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please Author is required"]
        },
    photo:{
        type: String,
        // required: [true, "Post Image is required"]
    },
},
{
    timestamps: true,
    toJSON:{virtuals: true}
});

//Hook
postSchema.pre(/^find/, function (next) {
    //add views count as virtual field
    postSchema.virtual("viewsCount").get(function (next){
        const post = this;
        return post.numViews.length;
    });
    //add likes count as virtual field
    postSchema.virtual("likesCount").get(function (next){
        const post = this;
        return post.likes.length;
    });
    //add dislikes count as virtual field
    postSchema.virtual("dislikesCount").get(function (next){
        const post = this;
        return post.dislikes.length;
    });
    //check the most liked post as virtual field
    postSchema.virtual("mostLikedPost").get(function (next){
        const post = this;
        const total = +post.likes.length + +post.dislikes.length;
        const percentage = (post.likes.length / total) * 100;
        return `${percentage}%`;
    });
    //check the most disLiked post as virtual field
    postSchema.virtual("mostdisLikedPost").get(function (next){
        const post = this;
        const total = +post.dislikes.length + +post.dislikes.length;
        const percentage = (post.dislikes.length / total) * 100;
        return `${percentage}%`;
    });

    //if days is less than 0 return today if 1 return yesterday else return days ago
    //check the most liked post as virtual field
    postSchema.virtual("dayAgo").get(function (next){
        const post = this;
        const date = new Date(post.createdAt);
        const daysAgo = Math.floor((Date.now() - date) / 86400000);
        return daysAgo === 0
        ? "Today"
        : daysAgo === 1
        ? "Yesterday"
        : `${daysAgo} Days Ago`;
    });
    next();
})

//compile Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;