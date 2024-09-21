module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
      
      return next(); // User is authenticated, proceed to the next middleware or route handler
    }  
    res.json({message:'not authenticated'}); // If not authenticated, redirect to the login page
  };
  