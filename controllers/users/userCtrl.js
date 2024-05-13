const User = require("../../model/User/User");
const bcrypt = require('bcryptjs');
const generateToken = require("../../utils/generateToken");
const getTokenFromHeaders = require("../../utils/generateTokenFromHeaders");
const { appErr, AppErr } = require("../../utils/appErr");
const isAdmin = require("../../middlewares/isAdmin");
const Category = require("../../model/Category/Category");
const Comment = require("../../model/Comment/Comment");
const Post = require("../../model/Post/Post");

//-------------------------------------
//Registering the user
//-------------------------------------
const userRegisterCtrl = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body; //To get data from frontend
  try {
    //cheking is the email already exist
    const userFound = await User.findOne({ email });
    if (userFound) {
      //display the error email already exists in json file
      throw new AppErr(409, "Email Already Exists!");
    } else {
      //Hashing the password before saving it in database
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ firstname, lastname, email, password: hashedPassword });
      const result = await newUser.save();
      const token = generateToken(result._id); //Generating a jwt token for this user
      res.status(200).json({ 
        userId: result._id,
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email,
        password: result.password,
         token });
    }
  } catch (error) {
    console.log(`Error in user register controller : ${error.message}`);
    next();
  }
};

//--------------------------------------
//Login of the user
//--------------------------------------
//trying to login the user to the system
const userloginCtrl = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if the email exist in the system
    const userFound = await User.findOne({ email });//we are using select
    //to hide the password from showing up on console

    if (!userFound) {
      return res.json({
        msg: 'Email is not found'
      });
    }
    //if the user exists then we will compare the entered password with the saved one
    const validPass = await bcrypt.compare(password, userFound.password);

    if (!validPass) {
      return res.status(401).send({ msg: "Invalid login credentials" })
    }

    //Return json response with success and token
    res.json({
      status: 'Login Successful',
      data: {
        firstname: userFound.firstname,
        lastname: userFound.lastname,
        email: userFound.email,
        isAdmin: userFound.isAdmin,
        token: generateToken(userFound._id),
      },
    });
  } catch (e) {
    //display the error in json
    res.status(500).json({ msg: e.message });
  }

}

//-------------------------------------
//Logout a logged-in user
//-------------------------------------
const logOutUser = (req, res) => {
  if (req.session) {
    //destroy session data
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.send('logged out');
    });
  } else {
    return res.status(404).send("Error! No Session Found");
  }
};

//-----------------------------------------
//Display who viewed my profile
//-----------------------------------------
//Checking users who has viewed my profile
const whoViewedMyProfileCtrl = async (req, res, next) => {
  try {
    //1. find the original
    const user = await User.findById(req.params.id);
    //2. find the user who viewed the original user
    const whoViewed = await User.findById(req.userAuth);
    //3. check if the original and who viewed are found
    if(user && whoViewed){
    //4. check if whoviewed is already in the users viewers array
    const isUseralreadyViewed = user.viewers.find(
      viewers => viewers.toString() === whoViewed._id.toJSON()
    );
    if(isUseralreadyViewed){
      res.json({
        status: "error",
        message:"This user has already viewed your profile"
      })
    }else{
      //5. Push the whoviewed to the user's viewers array
      user.viewers.push(whoViewed._id);
      //6. save the user
      await  user.save();
      res.json({
        status: "success",
        data: "You have successfully viewed this",
      })
    }
    }
    
  } catch (error) {
    res.json(error.message);
  }
};

//-----------------------------------------
//Exporting all User related functions
//-----------------------------------------
//User route in the system
const userCtrl = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({
      status: "success",
      data: users,
    })
  } catch (error) {
    res.json(error.message);
  }
};

//-----------------------------------------
//Exporting a User related function
//-----------------------------------------
//user profile route in the system
const userprofileCtrl = async (req, res, next) => {
  try {
    //showing the profile
    const user = await User.findById(req.userAuth);
    //display a response
    if(user){
      return res.status(200).send({
          message : 'Successfully fetched user details',
          user : user
      });
    }else{
        return res.status(404).send({
            message : 'No such user found'
        });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
}


//-------------------------------------
//Profile photo  upload controller
//-------------------------------------

// Define file upload controller
const fileUploadController = async (req, res, next) => {

  try {
    //1. find the user to be updated
    const userToUpdate = await User.findById(req.userAuth);
    //2 check if the user if found
    if (!userToUpdate) {
       throw new Error('No such user exists');
    }
    //3. Checking is user is blocked
    if (userToUpdate.isBlocked){
      //throw an error
      throw new Error ('You are blocked by admin! Contact Admin for further assistance');
    }
    //4. check if user is updating the image
    if(req.file){
      console.log(req.file);
    //5. update the profile photo
    await User.findByIdAndUpdate(
      req.userAuth,
      {
        $set: {
          profilePhoto: req.file.path,
        },
      },{
        new: true,
      }
    );
    res.json({
      status: "success",
      data: "profile photo uploaded"
    })
    }else{
      res.json({
        status:"error",
        message:'Please provide a valid image'
      });
      console.log("please provied a valide image");
    }
  } catch (error) {
      console.log(error.message)
  }
};

//-------------------------------------
//following users
//-------------------------------------
//update user in the system
const followingCtrl = async (req, res) => {
  try {
    //1. find user to follow
    const userToFollow=await User.findById(req.params.id);
    //2. find user who is following
    const userwhoFollowed = await User.findById(req.userAuth);
    //3. check if user and who followed are found
    if(userToFollow && userwhoFollowed){
    //4. Check if userToFollowed is already in user's followers array
    const isUseralreadyViewed = userToFollow.following.find(
      follower => follower.toString() === userwhoFollowed._id.toString()
    );
    if (isUseralreadyViewed){
      res.json({
        status : 'error',
        message : 'You have already Followed this user!'
      });
    }else{
      //5. Push userwhoFollowed to the user's followers array
      userToFollow.followers.push(userwhoFollowed._id);
      //push who userToFollow to the userWhoFollowed's following array
      userwhoFollowed.following.push(userToFollow._id);

      //save
      await userToFollow.save();
      await userwhoFollowed.save();
      //return response
      res.json({
        status: "success",
        data:{
          user: userToFollow,
        },
      });
    }
    }

  } catch (error) {
    res.json(error.message);
  }
};

//-------------------------------------
//Showing the unFollowing
//-------------------------------------
//update user in the system
const unFollowCtrl = async (req, res, next) => {
  try {
    //1. Find the user to unfollow
    const userToUnFollow = await User.findById(req.params.id);
    //2. Find the user who is unfollowing
    const userWhoIsUnFollowing = await User.findById(req.userAuth);
    //3. Check if the user exists or not
    if (userToUnFollow && userWhoIsUnFollowing){
      //4. check if they are friends or not
      const isUseralreadyFollowed = userToUnFollow.followers.find(
        follower => follower.toString() === userWhoIsUnFollowing._id.toString()
      );
      if(!isUseralreadyFollowed){
          //Display the error 
          return res.status(400).json({
            status:"fail",
            message:'You can only UnFollow users that you have followed before'
          })
      }else{
        
        //5. remove the user from the array of followers for the userToUnFollow
        userToUnFollow.follower=userToUnFollow.followers.filter((follower)=>
           follower.toString() !== userWhoIsUnFollowing._id.toString());
        //6. save the changes on the database
        await userToUnFollow.save();
        //7 Remove userTobeunfollowed from the userWhoUnfollowed's following array
        userWhoIsUnFollowing.following = userWhoIsUnFollowing.following.filter(following=>
          following.toString() != userToUnFollow._id.toString()
        );
        await userWhoIsUnFollowing.save();

        //8. send back a response 
       return res.status(200).json({
         status: 'success',
         data:{
           userInfo:userToUnFollow
         }
       });
      }
    }
  } catch (error) {
    res.json(error.message);
  }
};

//-------------------------------------
//Block User Profile
//-------------------------------------
//update user in the system
const blockUserCtrl = async (req, res, next) => {
  try {
    //1. find the user to be blocked
    const userToBeBlocked = await User.findById(req.params.id);
    //2. find the user who is blocking
    const userWhoBlocked = await User.findById(req.userAuth);
    //3. check if userToBeBlocked and userWhoBlocked are found
    if(userWhoBlocked && userToBeBlocked){
      //check if the userWhounfollowed is already in the user's blocked array
      const isUseralreadyBlocked  = userWhoBlocked.blocked.find(
        blocked => blocked.toString() === userToBeBlocked._id.toString()
      );

      if(isUseralreadyBlocked){
        return res.status(409).json({
          message:"This user has been blocked by you"
        })
      }else{
        //if not add it to the users blocked list
        userWhoBlocked.blocked.push(userToBeBlocked._id);
        //Update the user in the database with new information
        await userWhoBlocked.save();
        //send back a successfull request along with the updated user info
        return res.status(200).json({
          status:'sucess',
          data:{
            userInfo:userWhoBlocked
          }
        });
      }
    }
  } catch (error) {
    res.json(error.message);
  }
};

//-------------------------------------
//Unblock User Profile
//-------------------------------------
//update user in the system
const unblockUserCtrl = async (req, res) => {
  try {
    //1. find the user to be unblocked
    const userToBeUnBlocked = await User.findById(req.params.id);
    //2. find the user who is unblocking 
    const userWhoUnBlocked = await User.findById(req.userAuth);
    //3. check if userToBeUnBlocked and userWhoUnBlocked is already in the arrays's of userWhoUnBlocked
    const isUseralreadyBlocked = userWhoUnBlocked.blocked.find(
      blocked => blocked.toString() === userToBeUnBlocked._id.toString()
    );
    if (!isUseralreadyBlocked) {
      throw new Error("You haven't block this user");
    } else {
      //remove the user from the array of userWhoUnBlocked's blocked list
      userWhoUnBlocked.blocked.pull(userToBeUnBlocked._id);
      //Save the changes made on the userWhoUnBlocked
      await userWhoUnBlocked.save();
      //Return the updated user info
      return res.status(200).json({
        status:"success",
        data:{
          userRemovedFromList: "User has been removed from your Block List" ,
          userNow: userWhoUnBlocked
        }
      })
      }
  } catch (error) {
    res.json(error.message);
  }
};

//-------------------------------------
//Admin Block Profile
//-------------------------------------
//update user in the system
const adminBlockUserCtrl = async (req, res) => {
  try {
    //1. find the user to be unblocked
    const userToBeBlocked = await User.findById(req.params.id);
    //2. check if user is found
    if(!userToBeBlocked){throw new Error('No such user exists')}

    //Changed the isBlocked to true
    userToBeBlocked.isBlocked=true;
    
    //Update the user in the database
    await userToBeBlocked.save();
    //Send back a success response with the updated user details
    res.status(200).json({
      status:'success',
      data:userToBeBlocked
    });
  } catch (error) {
    res.json(error.message);
  }
};

//-------------------------------------
//Admin UnBlock Profile
//-------------------------------------
//update user in the system
const adminUnBlockUserCtrl = async (req, res) => {
  try {
    //1. find the user to be unblocked
    const userToBeUnBlocked = await User.findById(req.params.id);
    //2. check if user is found
    if(!userToBeUnBlocked){throw new Error('No such user exists')}

    //Changed the isBlocked to false
    userToBeUnBlocked.isBlocked=false;
    
    //Update the user in the database
    await userToBeUnBlocked.save();
    //Send back a success response with the updated user details
    res.status(200).json({
      status:'success',
      data:userToBeUnBlocked
    });
  } catch (error) {
    res.json(error.message);
  }
};

//-------------------------------------
//Update User Profile
//-------------------------------------
//update user in the system
const userUpdateCtrl = async (req, res, next) => {
  const { email, firstname, lastname } = req.body;
  try {
    //check if email is not taken by any other user
    if(email){

    const emailTaken = await User.findOne({email});
    if(emailTaken) throw new Error("Email already in use");

    }

    //update user details
    const user = await User .findByIdAndUpdate(req.userAuth,
      {
        firstname,
        lastname,
        email,
      },{
        new: true,
        runValidators: true,
      }
    )
    //send a response
    res.status(200).json({
      status:"succes",
      message:"Profile Updated Successfully!",
      data:user
    })
  } catch (error) {
    res.json(error.message);
  }
};

//-------------------------------------
//Update User Password
//-------------------------------------
//update user in the system
const userUpdatePasswordCtrl = async (req, res) => {
  const { password } = req.body;
  try {
    //check if user is updating the password
    if(password){
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //update user
      await User.findByIdAndUpdate(
          req.userAuth,
          { password: hashedPassword },
          { new: true, runValidators: true }
      );
      //response for success
      return res.status(200).json({
        status : "success",
        message : "User Password has been updated successfully.",
        });
    }else{
      throw new Error("Please provide your current password to update.");
    }
    
  } catch (error) {
    res.json(error.message);
  }
};

//-------------------------------------
//Update User Password
//-------------------------------------
//update user in the system
const deleteUserAccount = async (req, res, next) => {
  try {
    //find user to deleted
    const userToDelete = await User.findById(req.userAuth);
    //find all posts to be deleted
    await Post.deleteMany({ user: req.userAuth });
    //delete all comments of the user
    await Comment.deleteMany({ user: req.userAuth })
    //delete all the category
    await Category.deleteMany({ user: req.userAuth });

    await userToDelete.deleteMany();
    //send response
    return res.status(204).json({
      status:"Success",
      data:{
        userId: userToDelete._id
      },
      message: `The account with the id ${userToDelete._id} has been deleted.`
    });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  userRegisterCtrl,
  userloginCtrl,
  userCtrl,
  userprofileCtrl,
  userUpdateCtrl,
  logOutUser,
  getTokenFromHeaders,
  fileUploadController,
  whoViewedMyProfileCtrl,
  followingCtrl,
  unFollowCtrl,
  unblockUserCtrl,
  blockUserCtrl,
  adminBlockUserCtrl,
  adminUnBlockUserCtrl,
  userUpdatePasswordCtrl,
  deleteUserAccount
}