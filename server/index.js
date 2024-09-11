const express = require("express");
const cors = require("cors")
const passport = require('./config/passport');
const session = require('express-session');
const connectDb = require("./config/dbConnection");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Session 
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use Routes
app.use("/auth",require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/product", require("./routes/productRoutes"));

connectDb();

port = 3001 || process.env.PORT;
app.listen(port,() => {
    console.log("Server is running on port: ",port);
})
