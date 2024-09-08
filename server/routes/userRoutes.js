const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');

// Define the route for fetching user profiles
router.get('/profile/:userId', getUserProfile);

module.exports = router;
