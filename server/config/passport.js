// config/passport.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel'); // Adjust the path as needed
const bcrypt = require('bcrypt');

passport.use(
  new LocalStrategy(
    { usernameField: 'email' }, // Specify the field name if different
    async (email, password, done) => {
      try {
        console.log(`Attempting to authenticate user with email: ${email}`);

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          console.log('Authentication failed: User not found.');
          return done(null, false, { message: 'Incorrect email.' });
        }

        console.log(`User found: ${user.email}`);

        // Check if user has a password
        if (!user.password) {
          console.log('Authentication failed: User has no password set.');
          return done(null, false, { message: 'No password set for this user.' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match: ${isMatch}`);

        if (!isMatch) {
          console.log('Authentication failed: Incorrect password.');
          return done(null, false, { message: 'Incorrect password.' });
        }

        // Authentication successful
        console.log('Authentication successful.');
        return done(null, user);
      } catch (error) {
        console.error('Error during authentication:', error);
        return done(error);
      }
    }
  )
);

// Serialize and deserialize user instances to and from the session.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
