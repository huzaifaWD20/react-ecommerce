const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.userId}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });
// Upload profile picture
router.post('/profile/upload/:userId', upload.single('profilePicture'), userController.uploadProfilePicture);

// Define the route for fetching user profiles
router.get('/profile/:userId', userController.getUserProfile);

// Update user profile
router.put('/profile/:userId/edit', userController.updateUserProfile);

// GET /cart - Get user's cart
router.get('/carts' , userController.getCart);

// Add item to cart
router.post('/cart', userController.addToCart);

// Remove item to cart
router.post('/removecart', userController.removeCart);

// Get all users (admin only)
router.get('/users', userController.getAllUsers);

// Update user role (admin only)
router.put('/users/:userId/role', userController.updateUserRole);

module.exports = router;
