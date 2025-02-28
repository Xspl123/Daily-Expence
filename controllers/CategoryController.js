"use strict";

const { Category,User } = require("../models");

// ✅ Create a Category
exports.createCategory = async (req, res) => {
  try {
    const { name, type, sort_order, description, total_amount, budget } = req.body;
    const user_id = req.user ? req.user.id : null;

    // Check if user is authenticated
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Validate category name
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if category name is unique for this user
    const existingCategory = await Category.findOne({ where: { name, user_id } });

    if (existingCategory) {
      return res.status(400).json({ message: "Category name must be unique" });
    }

    // Create new category
    const newCategory = await Category.create({
      user_id,
      name: name.trim(),
      type: type || "default", // Default type if not provided
      sort_order: sort_order || 0,
      description: description?.trim() || "",
      total_amount: total_amount || 0,
      budget: budget || 0,
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
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const user_id = req.user.id;

    // Fetch categories for the authenticated user
    const categories = await Category.findAll({
      where: { user_id },
      attributes: ["id", "name", "type", "sort_order", "total_amount", "budget"],
      order: [["sort_order", "DESC"], ["createdAt", "DESC"]], // Sorting for better UX
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
            attributes: ['id',"name"],
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
    const userId = req.user.id; // Currently logged-in user ID

    const categories = await Category.findAll({
      attributes: ["id", "name", "type", "sort_order", "total_amount", "budget"],
      include: [
        {
          model: User,
          attributes: ["id", "name"],
          as: "user",
          where: { id: userId }, // Filter by logged-in user ID
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
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const user_id = req.user.id;

    // Find category belonging to the authenticated user
    const category = await Category.findOne({ where: { id: categoryId, user_id } });

    if (!category) {
      return res.status(404).json({ message: "Category not found or access denied" });
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
    await Category.update(req.body, { where: { id: categoryId, user_id } });

    // ✅ Fetch updated category
    const updatedCategory = await Category.findOne({ where: { id: categoryId, user_id } });

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
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
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const user_id = req.user.id;

    // Find category belonging to the authenticated user
    const category = await Category.findOne({ where: { id: categoryId, user_id } });

    if (!category) {
      return res.status(404).json({ message: "Category not found or access denied" });
    }

    await Category.destroy({ where: { id: categoryId, user_id } });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

