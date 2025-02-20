const { body } = require("express-validator");
const { Category } = require("../models");

const validateCategory = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .custom(async (value, { req }) => {
      const existingCategory = await Category.findOne({
        where: { name: value, user_id: req.user.userId },
      });

      if (existingCategory) {
        throw new Error("Category name must be unique for this user");
      }
    }),

  body("type")
    .notEmpty()
    .withMessage("Category type is required")
    .isIn(["Income", "Expense"])
    .withMessage("Category type must be either 'Income' or 'Expense'"),

  body("sort_order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sort order must be a positive integer"),

  body("total_amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a positive number"),

  body("budget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Budget must be a positive number"),
];

module.exports = {
  validateCategory,
};
