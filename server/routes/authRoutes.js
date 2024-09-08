const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController")

//Register User
router.post("/register", authController.registerUser);

//Login User
router.post("/login", authController.loginUser);

// Logout User
router.get('/logout', authController.logoutUser);

module.exports = router;