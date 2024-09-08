const User = require('../models/UserModel'); // Import your User model

// Controller function to get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from route parameters

    // Fetch user from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with user data (excluding sensitive information)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // Add other fields as needed
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getUserProfile };
