const express = require('express');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

const router = express.Router();
dotenv.config();

// Create a transporter for Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS
  }
});

// Generate OTP helper function
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

// Helper function to create a user
const createUser = async (name, email, password, phoneNumber) => {
  const user = new User({ name, email, password, phoneNumber });
  await user.save();
  return user;
};

// Send OTP for email verification
router.post('/send-otp', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate OTP and store it in session
    const otp = generateOTP();
    req.session.otp = otp;
    req.session.otpExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Send OTP email
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="background-color:#f7f7f7;padding:20px;text-align:center;">
          <div style="max-width:600px;margin:auto;background-color:#ffffff;padding:20px;border-radius:10px;">
            <h2 style="color:#319795;">Tech Jewel</h2>
            <p style="color:#4a5568;">Welcome to Tech Jewel, ${name}!</p>
            <p style="color:#4a5568;">Use the following OTP to verify your email address:</p>
            <h3 style="color:#319795;">${otp}</h3>
            <p style="color:#718096;">This OTP is valid for 10 minutes.</p>
            <p style="color:#4a5568;">If you didn't sign up, please ignore this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    // Store the user details in session for use after OTP verification
    req.session.tempUserData = { name, email, password, phoneNumber };

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});

// OTP Verification
router.post('/verify-otp', async (req, res) => {
  const { otp } = req.body
  console.log('User Entered : ',otp);
  console.log('Session OTP : ', req.session.otp);
  console.log('User Entered : ',typeof(otp));
  console.log('Session OTP : ', typeof(req.session.otp));
  // Check if OTP matches and hasn't expired
  if (req.session.otp !== otp || Date.now() > req.session.otpExpiration) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  // OTP is valid
  res.status(200).json({ message: 'OTP verified successfully' });
});

// User Signup - Called after OTP verification
router.post('/signup', async (req, res) => {
  try {
    // Retrieve the temporary user data stored during OTP process
    const { name, email, password, phoneNumber } = req.session.tempUserData;

    // Create the user
    const user = await createUser(name, email, password, phoneNumber);

    // Log the user in by setting the session
    req.session.userId = user._id;

    // Clear the session data (OTP and temp user data)
    delete req.session.otp;
    delete req.session.otpExpiration;
    delete req.session.tempUserData;

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error during signup' });
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
