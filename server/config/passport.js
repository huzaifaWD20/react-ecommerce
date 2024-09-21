const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// Serialize user for session
passport.serializeUser((user, done) => {
    // Serialize user ID into session
    done(null, user.id);  // Assuming user._id is the ID field in your User model
});

// Deserialize user for session
passport.deserializeUser(async (id, done) => {
    try {
        // Find user by ID and deserialize
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Local Strategy for authentication
passport.use(new LocalStrategy({
    usernameField: 'email',  // Use email as the username field
}, async (email, password, done) => {
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password!' });
        }
        
        // Authentication successful
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

module.exports = passport;
