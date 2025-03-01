const { body } = require("express-validator");
const db = require("../models");
const Account = db.Account;

const validateAccountCreation = [
  body("account_name")
    .notEmpty().withMessage("Account name is required")
    .custom(async (value, { req }) => {
      if (!req.user || !req.user.id) {
        throw new Error("Unauthorized: User not found");
      }

      const existingAccount = await Account.findOne({
        where: { account_name: value, user_id: req.user.id },
      });

      if (existingAccount) {
        throw new Error("Account name must be unique");
      }
      
      return true;
    }),

  body("account_balance")
    .optional({ nullable: true }) // ✅ NULL values allowed
    .custom((value) => {
      if (value !== null && value !== undefined && isNaN(value)) {
        throw new Error("Account balance must be a number or null");
      }
      return true;
    }),
];

const validateAccountUpdate = [
  body("account_name")
    .optional()
    .notEmpty().withMessage("Account name is required")
    .custom(async (value, { req }) => {
      if (!req.user || !req.user.id) {
        throw new Error("Unauthorized: User not found");
      }

      const existingAccount = await Account.findOne({
        where: { account_name: value, user_id: req.user.id },
      });

      if (existingAccount) {
        throw new Error("Account name must be unique");
      }

      return true;
    }),

  body("account_balance")
    .optional({ nullable: true }) // ✅ NULL values allowed
    .custom((value) => {
      if (value !== null && value !== undefined && isNaN(value)) {
        throw new Error("Account balance must be a number or null");
      }
      return true;
    }),
];

module.exports = {
  validateAccountCreation,
  validateAccountUpdate,
};
