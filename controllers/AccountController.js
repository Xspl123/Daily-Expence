"use strict";

const { Account, User } = require("../models");

// ✅ Create an Account
exports.createAccount = async (req, res) => {
  try {
    const { account_name, account_balance } = req.body;
    const user_id = req.user.userId;

    // Ensure account name is unique for this user
    const existingAccount = await Account.findOne({
      where: { account_name, user_id },
    });

    if (existingAccount) {
      return res.status(400).json({ message: "Account name must be unique" });
    }

    // Create new account
    const newAccount = await Account.create({
      user_id,
      account_name,
      account_balance: account_balance || 0,
    });

    return res.status(201).json({
      message: "Account created successfully",
      account: newAccount,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// ✅ Get All Accounts for a User
exports.getAccountsByUser = async (req, res) => {
  try {
    const user_id = req.user.userId;

    const accounts = await Account.findAll({ where: { user_id } });

    return res.status(200).json({
      message: "Accounts fetched successfully",
      accounts,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Get Account by ID
exports.getAccountById = async (req, res) => {
  try {
    const accountId = req.params.id;
    const user_id = req.user.userId;

    const account = await Account.findOne({
      where: { id: accountId, user_id },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.status(200).json({ account });
  } catch (error) {
    console.error("Error fetching account:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get All Users
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      attributes: ['account_name', 'account_balance'],
    });

    return res.status(200).json({
      message: 'Account fetched successfully',
      accounts,
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// ✅ Update Account
exports.updateAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const user_id = req.user.userId;
    const { account_name, account_balance } = req.body;

    // Find account belonging to the authenticated user
    const account = await Account.findOne({ where: { id: accountId, user_id } });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // ✅ Ensure new account name is unique (if changed)
    if (account_name && account_name !== account.account_name) {
      const existingAccount = await Account.findOne({
        where: { account_name, user_id },
      });

      if (existingAccount) {
        return res.status(400).json({ message: "Account name must be unique" });
      }
    }

    // ✅ Dynamically update only provided fields
    if (account_name) account.account_name = account_name;
    if (account_balance !== undefined) account.account_balance = account_balance;

    await account.save();

    return res.status(200).json({
      message: "Account updated successfully",
      account,
    });
  } catch (error) {
    console.error("Error updating account:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// ✅ Delete Account
exports.deleteAccount = async (req, res) => {
  
  try {
    const accountId = req.params.id;
    console.log("account", accountId);
    const user_id = req.user.userId;
    console.log(user_id);
    

    // Find account belonging to the authenticated user
    const account = await Account.findOne({ where: { id: accountId, user_id } });
    console.log("account", account);
    

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    await account.destroy();

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
