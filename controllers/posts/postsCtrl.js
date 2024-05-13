const Category = require("../../model/Category/Category");
const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");


//user wants to acces the post created
const postCreatedCtrl = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    //Find the user
    const author = await User.findById(req.userAuth);
    //check if user is blocked
    if (author.isBlocked) return res.status(403).json({ msg: "You are Blocked!" });
    //Create the post
    const postCreated = await Post.create({
      title,
      description,
      user: author._id,
      category,
      photo: req?.file?.path
    });
    //Associate User to a post -Push  the post into the user post field
    author.posts.push(postCreated)
    await author.save();
    return res.json({
      message: 'The post has been added',
      data: {
        post: postCreated
      },
    });
  } catch (error) {
    res.json(error.message);
  }
};

//user is trying to access all the post
const postsCreatedCtrl = async (req, res, next) => {
  try {
    //find all posts
    const posts = await Post.find({})
      .populate('user')
      .populate('category', 'title');

    //check if the user is blocked by the post owner
    const filteredPosts = posts.filter(post => {
      //get all blocked users
      const blockedUsers = post.user.blocked;
      const isBlocked = blockedUsers.includes(req.userAuth);

      return isBlocked ? null : post;
    })
    res.json({
      status: "success",
      data: filteredPosts,
    })
  } catch (error) {
    res.json(error.message);
  }
}

//user is trying to access a single post
const postDetailsCtrl = async (req, res, next) => {
  try {
    //find the post
    const post = await Post.findById(req.params.id);
    //if there's no such post
    if (!post) throw new Error("No post with this id.");
    //check if viewer has viewed this post
    const isViewed = post.numViews.includes(req.userAuth);
    if (isViewed) {
      res.json({
        status: "success",
        data: post,
      })
    } else {
      //push the user into numOfViews
      post.numViews.push(req.userAuth);
      //save
      await post.save();
      res.json({
        status: "success",
        data: post,
      })
    }

  } catch (error) {
    res.json(error.message);
  }
}

//user deleted the post
const postDeletedCtrl = async (req, res, next) => {
  try {
    //check if the post belongs to the user
    //find the post
    const post = await Post.findById(req.params.id);
    if(post.user.toString() !== req.userAuth.toString()){
      return res.status(401).
      json({ error: 'User not authorized to delete this post.' });
    }
    res.json({
      status: "success",
      data: " delete post route",
    })
  } catch (error) {
    res.json(error.message);
  }
}

//user just update the created post
const postUpdateCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    //check if the post belongs to the user
    //find the post
    const post = await Post.findById(req.params.id);
    //check if the post belongs to the user
    if(post.user.toString() !== req.userAuth.toString()){
      return res.status(401).
      json({ error: 'User not authorized to update this post.' });
    }
    await Post.findByIdAndUpdate(req.params.id,{
      title,
      description,
      category,
      photo: req?.file?.path  || post.photo
      },{new: true});


    res.json({
      status: "success",
      data: " You just update this post",
    })
  } catch (error) {
    res.json(error.message);
  }
};

//user just liked the post
const toggleLikePostCtrl = async (req, res) => {
  try {
    //1. Get the post
    const post = await Post.findById(req.params.id);
    //2. check if the user has already liked the post
    const isLiked = post.likes.includes(req.userAuth);
    //3. if the user has liked the post unlike the post
    //else like the post and push it to 
    //the users likes array
    if (isLiked) {
      post.likes = post.likes.filter(
        like => like.toString() !== req.userAuth.toString());
      await post.save();
    } else {
      //4. if the user has not liked the post like the post
      post.likes.push(req.userAuth);
      await post.save();
    }

    res.json({
      status: "success",
      data: post,
    })
  } catch (error) {
    res.json(error.message);
  }
};

//user just liked the post
const toggleDisLikePostCtrl = async (req, res) => {
  try {
    //1. Get the post
    const post = await Post.findById(req.params.id);
    //2. check if the user has already liked the post
    const isDisLiked = post.dislikes.includes(req.userAuth);
    //3. if the user has liked the post unlike the post
    //else like the post and push it to 
    //the users likes array
    if (isDisLiked) {
      post.dislikes = post.dislikes.filter(
        dislike => dislike.toString() !== req.userAuth.toString());
      await post.save();
    } else {
      //4. if the user has not liked the post like the post
      post.dislikes.push(req.userAuth);
      await post.save();
    }

    res.json({
      status: "success",
      data: post,
    })
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  postCreatedCtrl,
  postsCreatedCtrl,
  postDeletedCtrl,
  postUpdateCtrl,
  toggleLikePostCtrl,
  toggleDisLikePostCtrl,
  postDetailsCtrl
};