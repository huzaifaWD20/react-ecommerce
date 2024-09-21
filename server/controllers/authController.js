const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const passport = require('passport');


exports.registerUser = async(req,res) => {
    try {
        const hashedPasword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPasword

        });
        await user.save();
        res.status(201).json({message: "User created successfully"});
  
    } catch (error) {
        console.log("Error during registration: ",error);
        res.status(500).json({message: 'Server error'});

        
    }
}

exports.loginUser = async (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(404).json({ message: 'Login error!' });

    req.logIn(user, (err) => {
      if (err) return next(err);

      try {
        // Ensure the response contains the required user information
        return res.status(200).json({
          message: 'Login successful',
          _id: user._id,
          name: user.name,
          email: user.email,
          // Add other fields as needed
        });
      } catch (error) {
        console.log('Error during login:', error);
        return next(error);
      }
    });
  })(req, res, next);
};

  

exports.logoutUser =  (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      req.session.destroy(); // Destroy session
      res.clearCookie('connect.sid'); // Clear session cookie
      res.status(200).json({ message: 'Logged out successfully' });
    });
  };
  