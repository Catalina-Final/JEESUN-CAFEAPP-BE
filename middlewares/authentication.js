const jwt = require("jsonwebtoken");
const { catchAsync, AppError } = require("../helpers/utils.helper");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const authMiddleware = {};
const User = require("../models/user");

authMiddleware.loginRequired = catchAsync(async (req, res, next) => {
  const tokenString = req.headers.authorization;
  if (!tokenString) return next(new AppError(401, "Token not found"));
  const token = tokenString.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError(401, "Token expired"));
      } else {
        return next(new AppError(401, "Token is invalid"));
      }
    }
    req.userId = payload._id;
  });
  next();
});

authMiddleware.ownerRequired = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return next(new AppError(401, "Unauthorized"));
  }
  if (user.role !== "owner") {
    return next(new AppError(401, "Unauthorized, only Owner can access"));
  }
  req.owner = user;
  next();
});

authMiddleware.adminRequired = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return next(new AppError(401, "Unauthorized"));
  }
  if (user.role !== "admin") {
    return next(new AppError(401, "Unauthorized, only Admin can access"));
  }
  req.admin = user;
  next();
});

module.exports = authMiddleware;
