const express = require('express');
const {
  userRegisterCtrl,
  userloginCtrl,
  userCtrl,
  userprofileCtrl,
  userUpdateCtrl,
  whoViewedMyProfileCtrl,
  followingCtrl,
  unFollowCtrl,
  blockUserCtrl,
  unblockUserCtrl,
  fileUploadController, 
  adminBlockUserCtrl,
  userUpdatePasswordCtrl,
  adminUnBlockUserCtrl,
  deleteUserAccount} = require("../../controllers/users/userCtrl");
const isLogin = require('../../middlewares/isLogin');
const multer = require('multer');
const imageUpload = require('../../config/cloudinary');
const isAdmin = require('../../middlewares/isAdmin');


const userRouter = express.Router();

const upload = multer({ imageUpload });

//Post/api/v1/users/register
userRouter.post('/register', userRegisterCtrl);

//Post/api/v1/users/login
userRouter.post('/login', userloginCtrl);

//GET/api/v1/users/:id
userRouter.get('/profile/', isLogin, userprofileCtrl);

//GET/api/v1/users
userRouter.get('/', userCtrl);

//PUT/api/v1/users/:id
userRouter.put('/', isLogin, userUpdateCtrl);

//GET/api/v1/users/profile-viewer/:id
userRouter.get('/profile-viewer/:id', isLogin, whoViewedMyProfileCtrl);

//GET/api/v1/users/following/:id
userRouter.get('/following/:id', isLogin, followingCtrl);

//GET/api/v1/users/unfollow/:id
userRouter.get('/unfollow/:id', isLogin, unFollowCtrl);

//GET/api/v1/users/block-user/:id
userRouter.get('/block-user/:id', isLogin, blockUserCtrl);

//GET/api/v1/users/unblock-user/:id
userRouter.get('/unblock-user/:id', isLogin, unblockUserCtrl);

//Put/api/v1/users/admin-block/:id
userRouter.put('/admin-block/:id', isLogin, isAdmin, adminBlockUserCtrl);

//Put/api/v1/users/admin-unblock/:id
userRouter.put('/admin-unblock/:id', isLogin, isAdmin, adminUnBlockUserCtrl);

//Put/api/v1/users/admin-unblock/:id
userRouter.put('/update-password/', isLogin, userUpdatePasswordCtrl);

//Delete/api/v1/users/admin-unblock/:id
userRouter.delete('/delete-account', isLogin, deleteUserAccount);

//POST/api/v1/users/:id
userRouter.post('/profile-photo-upload',
  isLogin,
  upload.single("profile"),
  fileUploadController);


module.exports = userRouter; 