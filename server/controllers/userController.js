const mongoose = require('mongoose');
const User = require('../models/UserModel'); // Import your User model

// Example of a fetch user endpoint
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Send back all necessary user details, including profilePicture
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profilePicture = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  const userId = req.params.userId; // Get user ID from URL parameters
  const { name, email, phone, address } = req.body; // Extract data from request body

  try {
    // Find user by ID and update their profile
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, address },
      { new: true, runValidators: true } // Return the updated user and validate
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error });
  }
};


exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Basic validation
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId format' });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid productId format' });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive integer' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingItem = user.cart.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({productId: productId,  quantity });
    }

    await user.save();
    res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
};


exports.removeCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Basic validation
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId format' });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid productId format' });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive integer' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingItem = user.cart.find((item) => item.productId.toString() === productId);

    if (existingItem) {
      // Remove the item entirely
      user.cart.pull({ productId: productId });
      console.log(`Removed product ${productId} from the cart.`);
    } else {
      return res.status(400).json({ message: 'Product not found in cart.' });
    }

    await user.save();
    res.status(200).json({ message: 'Cart updated successfully.', cart: user.cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res
      .status(500)
      .json({ message: 'Error updating cart.', error: error.message });
  }
};


// Controller function to get the cart of a logged-in user
exports.getCart = async (req, res) => {
  try {
    // Retrieve the userId from the authenticated user in the session
    const userId = req.headers['x-user-id']; // Get user ID from headers    console.log('User ID:', userId); // Debugging purposes

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Find the user by ID and populate cart items with product details
    const user = await User.findById(userId).populate('cart.productId').exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the cart items as the response
    res.json({ cart: user.cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

