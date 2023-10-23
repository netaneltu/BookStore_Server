const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Product = require("../models/Product");

module.exports = {
  // managers functions

  getAllCategoriesForManagers: async (req, res) => {
    try {
      const categories = await Category.find().populate("subcategories").exec();

      
      
      return res.status(200).json({
        success: true,
        message: `success to find all categories - for managers`,
        categories,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all categories - for -managers`,
        error: error.message,
      });
    }
  },
  getAllSubCategoriesForManagers: async (req, res) => {
    try {
      const subcategories = await SubCategory.find().exec();

      
      
      return res.status(200).json({
        success: true,
        message: `success to find all categories - for managers`,
        subcategories,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all categories - for -managers`,
        error: error.message,
      });
    }
  },

  getCategoryByIdForManagers: async (req, res) => {
    try {
      const id = req.params.id;

      const category = await Category.findById(id).populate("subcategories").exec();

      return res.status(200).json({
        success: true,
        message: `success to find category by id - for managers`,
        category,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get category by id - for -managers`,
        error: error.message,
      });
    }
  },

  addNewCategoryForManagers: async (req, res) => {
    try {
      const { category_name } = req.body;

      const category = new Category({
        category_name,
      });

      await category.save();

      return res.status(200).json({
        success: true,
        message: `success to add new category - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in add new category - for managers`,
        error: error.message,
      });
    }
  },
  addNewSubCategoryForManagers: async (req, res) => {
    try {
      const { parent_category, category_name } = req.body;

      const subCategory = new SubCategory({
        parent_category,
        category_name,
      });

      await subCategory.save();
      const parentData = JSON.parse(parent_category);
      await Category.findByIdAndUpdate(parentData.id, {
        $push: { subcategories: subCategory },
      });

      return res.status(200).json({
        success: true,
        message: `success to add new sub_category - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in add new sub_category - for managers`,
        error: error.message,
      });
    }
  },

  updateCategoryByIdForManagers: async (req, res) => {
    try {
      const id = req.params.id;
     
      const { category_name } = req.body;
      if(category_name.length==0){
        throw new Error("pleas enter a valid name")
      }
      await Category.findByIdAndUpdate(id, {
        category_name,
      });

      return res.status(200).json({
        success: true,
        message: `success to update category by id - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in update category by id - for managers`,
        error: error.message,
      });
    }
  },
  updateSubCategoryByIdForManagers: async (req, res) => {
    try {
      const id = req.params.id;
      const { category_name } = req.body;
      if(category_name.length==0){
        throw new Error("pleas enter a valid name")
      }
      await SubCategory.findByIdAndUpdate(id, {
        category_name,
      });

      return res.status(200).json({
        success: true,
        message: `success to update category by id - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in update category by id - for managers`,
        error: error.message,
      });
    }
  },
  deleteCategoryByIdForManagers: async (req, res) => {
    try {
      const id = req.params.id;

      const exists = await Product.findOne({ "categories.category": id });

      if (exists) {
        throw new Error(
          "cannot delete category because have products related to this category"
        );
      }

      await Category.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: `success to delete category by id - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in delete category by id - for managers`,
        error: error.message,
      });
    }
  },
  deleteSubCategoryByIdForManagers: async (req, res) => {
    try {
      const id = req.params.id;

      const exists = await Product.findOne({ "categories.category": id });

      if (exists) {
        throw new Error(
          "cannot delete category because have products related to this category"
        );
      }

      await SubCategory.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: `success to delete category by id - for managers`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in delete category by id - for managers`,
        error: error.message,
      });
    }
  },

  //___________________

  // customers functions
  getAllCategoriesForCustomers: async (req, res) => {
    try {
      
     
      const  categories = await Category.find().populate("top_products subcategories").exec();
   
    
      return res.status(200).json({
        success: true,
        message: `success to find all categories - for customer`,
        categories,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all categories - for -customer`,
        error: error.message,
      });
    }
  },
  topProducts: async (req, res) => {
    try {
      
      const id = req.params.id;

      const category= await Category.findById(id).populate("top_products").exec();
      const topProducts=category.top_products

     

      return res.status(200).json({
        success: true,
        message: `success to get top products `,
        topProducts
      });
    } catch (error) {
      return res.status(500).json({
        message: `error to get top products `,
        error: error.message,
      });
    }
  },
  //___________________
};
