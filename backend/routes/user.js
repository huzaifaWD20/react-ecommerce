const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Fetch current user information
router.get('/current', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const user = await User.findById(req.session.userId);
  res.json({ id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber, profilePic: user.profilePic });
});

module.exports = router;
