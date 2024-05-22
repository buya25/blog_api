const express = require('express');
const {
  createNewCategoryCtrl,
  getAllCategoriesCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
  getOneCategoryCtrl
} =  require("../../controllers/categories/categoriesCtrl");
const isLogin = require('../../middlewares/isLogin');


const categoriesRouter = express.Router();

//Post/api/v1/categories
categoriesRouter.post('/', isLogin, createNewCategoryCtrl);

  //GET/api/v1/categories/:id
categoriesRouter.get('/:id', getOneCategoryCtrl);

  //GET/api/v1/categories
categoriesRouter.get('/', isLogin, getAllCategoriesCtrl);


  //DELETE/api/v1/categories/:id
categoriesRouter.delete('/:id', isLogin, deleteCategoryCtrl);

  //PUT/api/v1/categories/:id
categoriesRouter.put(`/:id`, isLogin, updateCategoryCtrl);  



module.exports = categoriesRouter;