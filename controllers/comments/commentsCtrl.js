const Comment = require("../../model/Comment/Comment");
const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");

//user just commented
const commentCreatedCtrl = async (req, res, next) => {
    const { description }  = req.body;
    try {
        //Find the post 
        const post = await Post.findById(req.params.id);
        //create the comment
        const newComment = await Comment.create({
            user: req.userAuth,
            post: post._id,
            description
            });
        //push the comments to post
        post.comments.push(newComment._id);
        //Find the user
        const user = await User.findById(req.userAuth);
        //Push comment to user
        user.comments.push(newComment._id);
        //save
        await user.save({ validateBeforeSave: false });
        await post.save({ validateBeforeSave: false });
        res.json({
            status: "success",
            data: newComment,
        })
    } catch (error) {
        res.json(error.message);
    }
};

//user accessing the comment
const getCommentCtrl = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        //send the response
        if (!comment) throw new Error("Category not found");
        res.json({
            status: "success",
            message: null,
            data: {
              comment
              }
         });
    } catch (error) {
      res.json(error.message);
    }
};

//user accessing all the comments created by them
const getUserCommentsCtrl = async (req, res) => {
    try {
        const comments = await Comment.find();
    res.json({
      status: "success",
      message: null,
      data: {
        comments
      },
    });
    } catch (error) {
        res.json(error.message);
    }
};

//user deletes the comment created
const deleteCommentCtrl = async (req, res, next) => {
    try {
         //find the comment
    //find the comment
    const comment = await Comment.findById(req.params.id);

    if (comment.user.tostring !== req.userAuth.tostring){
        return res.status(401).
        json({ status:"fail", message: "You are not authorized to perform this action"});
    }

    //delete it
    await Comment.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            data: " delete comments route",
        })
    } catch (error) {
        res.json(error.message);
    }
};

//user update the comment created
const updateCommentCtrl = async (req, res, next) => {
    const { description } = req.body;
  try {
    //find the comment
    const comment = await Comment.findById(req.params.id);

    if (comment.user.tostring !== req.userAuth.tostring){
        return res.status(401).
        json({ status:"fail", message: "You are not authorized to perform this action"});
    }

    const category = await Comment.findByIdAndUpdate(
      req.params.id,
      {description},
      {new: true, runValidators: true}
    );
    //send a response
    res.status(201).json({
        status:"sucess",
        message:null,
        data:{
          category
          }
     });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
    commentCreatedCtrl,
    getCommentCtrl,
    getUserCommentsCtrl,
    deleteCommentCtrl,
    updateCommentCtrl
}