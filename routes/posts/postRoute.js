const express = require('express');
const {
  postCreatedCtrl,
  postsCreatedCtrl,
  postDeletedCtrl,
  postUpdateCtrl,
  toggleLikePostCtrl,
  toggleDisLikePostCtrl,
  postDetailsCtrl
} = require("../../controllers/posts/postsCtrl");
const isLogin = require('../../middlewares/isLogin');
const multer = require('multer');
const storage = require("../../config/cloudinary");




const postRouter = express.Router();

//file upload middleware
const upload = multer({ storage });


//POST/api/v1/post-created/:id
postRouter.post('/post-created', isLogin, upload.single("image"), postCreatedCtrl);

//GET/api/v1/posts
postRouter.get('/', isLogin, postsCreatedCtrl);

//GET/api/v1/posts
postRouter.get('/:id', isLogin, postDetailsCtrl);

//GET/api/v1/like-post
postRouter.get('/likes/:id', isLogin, toggleLikePostCtrl);

//GET/api/v1/dislike-post
postRouter.get('/dislikes/:id', isLogin, toggleDisLikePostCtrl);

//DELETE/api/v1/posts/:id
postRouter.delete('/:id', isLogin, postDeletedCtrl);

//PUT/api/v1/posts/:id
postRouter.put('/:id', isLogin, upload.single("image"), postUpdateCtrl);


module.exports = postRouter;