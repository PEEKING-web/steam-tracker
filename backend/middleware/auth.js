// Middleware to check if user is authenticated
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is logged in, proceed
  }
  
  // User is not logged in
  res.status(401).json({ 
    error: 'Unauthorized', 
    message: 'You must be logged in to access this resource' 
  });
};

// Middleware to attach user to response
export const attachUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};