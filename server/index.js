const express = require("express");
const cors = require("cors")
const passport = require('./config/passport');
const session = require('express-session');
const connectDb = require("./config/dbConnection");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require("dotenv").config();

const app = express();

// Serve static files for profile pictures
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true // Allow credentials like session cookies to be sent
}));

// Session 
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    
}))

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use Routes
app.use("/auth",require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/product", require("./routes/productRoutes"));
app.use("/orders", require("./routes/orderRoutes"));
app.use('/uploads', express.static('uploads'));

connectDb();

port = 3001 || process.env.PORT;
app.listen(port,() => {
    console.log("Server is running on port: ",port);
})
