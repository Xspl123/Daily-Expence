const express = require('express');
const router = express.Router();

// Import All Controllers
const UserController = require('../controllers/UserController');
const AccountController = require('../controllers/AccountController');
const TransactionController = require('../controllers/TransactionController');
const CategoryController = require("../controllers/CategoryController");

// Import Middlewares
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');

// Import Validators
const {validateUserRegistration,validateUserLogin,validateUserUpdate} = require('../validators/userValidator');
const { validateAccountCreation,validateAccountUpdate} = require('../validators/accountValidator');
const {validateCategory} = require("../validators/categoryValidator")

// ===============================
// 🚀 User Routes
// ===============================
router.post('/users/register', validateUserRegistration, validate, UserController.registerUser);
router.post('/users/login', validateUserLogin, validate, UserController.loginUser);
router.get('/users/me', auth, UserController.getUserDetails);
router.get('/users/list', auth, UserController.getAllUsers);
router.put('/users/:id', auth, validateUserUpdate, validate, UserController.updateUserById);
router.put('/users/update', auth, validateUserUpdate, validate, UserController.updateUser);
router.post('/users/logout', auth, UserController.logoutUser);

// ===============================
// 🚀 Account Routes
// ===============================
router.post('/account-create', auth, validateAccountCreation, validate, AccountController.createAccount);
router.get('/accounts', auth, AccountController.getAllAccounts);
router.get('/accounts/:id', auth, AccountController.getAccountById);
router.put('/accounts/:id', auth, validateAccountUpdate, validate, AccountController.updateAccount);
router.delete('/accounts/:id', auth, AccountController.deleteAccount);

// ===============================
// 🚀 Category Routes
// ===============================
router.post('/category-create',auth, validateCategory, CategoryController.createCategory);
router.get('/categories', auth,CategoryController.getAllCategories);
router.get('/category/:id', auth,CategoryController.getCategoryById);
router.put('/category-update/:id', auth,validateCategory, CategoryController.updateCategory);
router.delete('/category-delete/:id', auth,CategoryController.deleteCategory);

// ===============================
// 🚀 Transaction Routes
// ===============================
router.post('/transactions/create-transaction', auth, TransactionController.createTransaction);
//router.get('/transactions', auth, TransactionController.getAllTransactions);
//router.get('/transactions/:id', auth, TransactionController.getTransactionById);
//router.put('/transactions/:id', auth, TransactionController.updateTransaction);
//router.delete('/transactions/:id', auth, TransactionController.deleteTransaction);

module.exports = router;
