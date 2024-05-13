const Category = require("../../model/Category/Category");

//Create a new category
//app.post('/api/categories', function
const createNewCategoryCtrl = async (req, res) => {
  const { title } = req.body;
  try {
    const category = await Category.create({ title, user: req.userAuth });
    //send a success response
    return res.status(201).json({
      status: 'success',
      message: "category created",
      data: {
        category
      }
    })
  } catch (error) {
    //respond with a json error
    res.json({
      status: 'fail',
      message: error.message
    });
  }
};

//accessing all the categories
const getAllCategoriesCtrl = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      status: "success",
      message: null,
      data: {
        categories
      },
    });
  } catch (error) {
    res.json(error.message);
  }
};

//accesing the specific category
const getOneCategoryCtrl = async (req, res) => {
  try {
      const category = await Category.findById(req.params.id);
      //send the response
      if (!category) throw new Error("Category not found");
      res.json({
          status: "success",
          message: null,
          data: {
            category
            }
       });
  } catch (error) {
    res.json(error.message);
  }
};

//Deleting the created category
const deleteCategoryCtrl = async (req, res) => {
  try {
    const categoryDelete = await Category.findByIdAndDelete(req.params.id);
    //check if the category exist
    if(!categoryDelete) throw new Error('The category is already deleted');
    
    //respond to delete
    res.json({
      status:"sucess",
      message: 'The category has been deleted',
      data:{
        categoryDelete
      }
    });
  } catch (error) {
    res.json(error.message);
  }
};

//Updating the category created
const updateCategoryCtrl = async (req, res) => {
  const { title } = req.body;
  try { //find all posts
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
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {title},
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
  createNewCategoryCtrl,
  getAllCategoriesCtrl,
  getOneCategoryCtrl,
  deleteCategoryCtrl,
  updateCategoryCtrl
} 