const User = require("../models/User");

const jwt = require("jsonwebtoken");

const ErrorHandler = require("../utils/errorHandler");

// Checks if user is authenticated or not

exports.isAuthenticatedUser = async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    token = req.headers.authorization;
  }else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorHandler("Login first to access this resource.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
};

exports.authorizeRoles = (...roles) => {


  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to acccess this resource`,
          403
        )
      );
    }

    next();
  };
};
