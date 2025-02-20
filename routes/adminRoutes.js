const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const verifyToken = require('../middleware/authMiddleware');

// Admin Authentication Routes
router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.get('/logout', adminController.logout);

// Protected Routes (Requires Token)
router.get('/dashboard', verifyToken, adminController.dashboard);
router.get('/users', verifyToken, adminController.users);

module.exports = router;
