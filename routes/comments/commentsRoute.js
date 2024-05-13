const express = require('express');
const {
  commentCreatedCtrl,
  getCommentCtrl,
  getUserCommentsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl
} = require("../../controllers/comments/commentsCtrl");
const isLogin = require('../../middlewares/isLogin');

const commentsRouter = express.Router();

//Post/api/v1/comments
commentsRouter.post('/:id', isLogin, commentCreatedCtrl);

//GET/api/v1/comments/:id
commentsRouter.get('/:id', getCommentCtrl);


//GET/api/v1/comments
commentsRouter.get('/', isLogin, getUserCommentsCtrl);


//DELETE/api/v1/comments/:id
commentsRouter.delete('/:id', isLogin, deleteCommentCtrl);

//PUT/api/v1/comments/:id
commentsRouter.put('/:id', isLogin, updateCommentCtrl);

module.exports = commentsRouter;
