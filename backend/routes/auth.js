const express = require('express');
const User = require('../models/User');

const router = express.Router();

// User Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const user = await User.create({ name, email, password, phoneNumber });
    req.session.userId = user._id; // Save user ID to session
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    req.session.userId = user._id; // Save user ID to session
    res.json({ user: { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.status(200).json({ message: 'Logged out' });
  });
});

// Check Authentication Status
router.get('/check-auth', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

module.exports = router;
