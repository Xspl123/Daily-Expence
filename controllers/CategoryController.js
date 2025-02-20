"use strict";

const { Category,User } = require("../models");

// ✅ Create a Category
exports.createCategory = async (req, res) => {
    try {
      const { name,type, sort_order,description,total_amount,budget} = req.body;
      const user_id = req.user ? req.user.userId : null;
  
      // Validate request data
      if (!user_id) {
        return res.status(401).json({ message: "Unauthorized access" });
      }
  
      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }
  
      // Ensure category name is unique for this user
      const existingCategory = await Category.findOne({
        where: { name, user_id },
      });
  
      if (existingCategory) {
        return res.status(400).json({ message: "Category name must be unique" });
      }
  
      // Create new category
      const newCategory = await Category.create({
        user_id,
        name,
        type,
        sort_order,
        description: description || "",
        total_amount,
        budget
      });
  
      return res.status(201).json({
        message: "Category created successfully",
        category: newCategory,
      });
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };
  

// ✅ Get All Categories for a User
exports.getCategoriesByUser = async (req, res) => {
  try {
    const user_id = req.user.userId;

    const categories = await Category.findAll({ where: { user_id } });

    return res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Get Category by ID
exports.getCategoryById = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const user_id = req.user.userId;
  
      const category = await Category.findOne({
        where: { id: categoryId, user_id },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["name"],
          },
        ],
      });
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      return res.status(200).json({ category });
    } catch (error) {
      console.error("Error fetching category:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };
  

// ✅ Get All Categories (Admin or General)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
        attributes: ["id", "name", "type", "sort_order","total_amount","budget"],
        include: [
          {
            model: User,
            attributes: ["id","name"],
            as: "user",
          },
        ],
        order: [
          ["sort_order", "DESC"],
          ["created_at", "DESC"],
        ],
      });
      
    return res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Update Category
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const user_id = req.user.userId;

    // Find category belonging to the authenticated user
    const category = await Category.findOne({ where: { id: categoryId, user_id } });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // ✅ Check if the new category name is unique (if changed)
    if (req.body.name && req.body.name !== category.name) {
      const existingCategory = await Category.findOne({
        where: { name: req.body.name, user_id },
      });

      if (existingCategory) {
        return res.status(400).json({ message: "Category name must be unique" });
      }
    }

    // ✅ Update only provided fields dynamically
    Object.keys(req.body).forEach((key) => {
      category[key] = req.body[key];
    });

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// ✅ Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const user_id = req.user.userId;

    // Find category belonging to the authenticated user
    const category = await Category.findOne({ where: { id: categoryId, user_id } });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
