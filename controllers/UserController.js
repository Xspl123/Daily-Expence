require('dotenv').config();

const { User } = require('../models');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 


exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Ensure all necessary fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating a new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT token using SESSION_SECRET from .env
    const payload = { userId: newUser.id };
    const token = jwt.sign(payload, process.env.SESSION_SECRET, { expiresIn: '24h' });

    // Send response with token and user data
    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token,
    });

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};



// Login a User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token using SESSION_SECRET from .env
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.SESSION_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get User Details by ID
exports.getUserDetails = async (req, res) => {
  // Ensure req.user is set by your auth middleware
  const userId = req.user.userId; // This should work if req.user exists

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'created_at'],
    });

    return res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Update User by ID
exports.updateUserById = async (req, res) => {
  const userId = req.params.id; // Get user ID from route params
  const { name, email, password } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    return res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Update User Details
exports.updateUser = async (req, res) => {
  const userId = req.user.userId;
  const updates = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Check if the email already exists (but not for the same user)
    if (updates.email && updates.email !== user.email) {
      const existingUser = await User.findOne({ where: { email: updates.email } });

      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: 'Email already in use by another user' });
      }
    }

    // ✅ Dynamically update only provided fields
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined && key !== 'password') {
        user[key] = updates[key];
      }
    });

    // ✅ Hash password if updating
    if (updates.password) {
      user.password = await bcrypt.hash(updates.password, 10);
    }

    await user.save();

    return res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


// Logout User (Invalidate JWT Token)
exports.logoutUser = (req, res) => {
  // Since JWT is stateless, logout is handled on the client side by removing the token
  return res.status(200).json({ message: 'Logged out successfully' });
};
