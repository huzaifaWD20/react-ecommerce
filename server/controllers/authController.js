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

exports.loginUser = async(req,res,next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) return next(err);
        if(!user) return res.status(404).json({message: "login error!"});

        req.logIn(user, async (err) => {
            if(err) return next(err);

            try{
                return res.status(200).json({message:"login successfull"}),
                user
            } catch(error){
                console.log("Error during login: ",error);
                return next(error);
            }
        })
    })(req, res, next);
}

exports.logoutUser =  async (req, res, next) => {
    if(!req.user || !req.user.id) {
        console.error("User is not authenticated or User ID is missing");
        return res.status(401).json({message: "Unauthorized"});
    }

    try {
        req.logout(err => {
            if (err) {
                console.error("Error during logout: ", err);
                return next(err);
        }

        return res.status(200).json({message: "successfully logout"})
    });
    }catch (error) {
        console.log("Error during logout: ", error);
        return next(error);
    }
}