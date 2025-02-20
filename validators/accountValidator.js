const { body } = require('express-validator');
const db = require('../models');
const Account = db.Account; 

const validateAccountCreation = [
  body('account_name')
    .notEmpty().withMessage('Account name is required')
    .custom(async (value, { req }) => {
      const existingAccount = await Account.findOne({
        where: { account_name: value, user_id: req.user.userId },
      });

      if (existingAccount) {
        throw new Error('Account name must be unique');
      }
    }),
  
  body('account_balance')
    .isFloat({ gt: 0 }).withMessage('Account balance must be a positive number'),
];

const validateAccountUpdate = [
  body('account_name')
    .optional()
    .notEmpty().withMessage('Account name is required')
    .custom(async (value, { req }) => {
      const existingAccount = await Account.findOne({
        where: { account_name: value, user_id: req.user.userId },
      });

      if (existingAccount) {
        throw new Error('Account name must be unique');
      }
    }),

  body('account_balance')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Account balance must be a positive number'),
];

module.exports = {
  validateAccountCreation,
  validateAccountUpdate,
};
