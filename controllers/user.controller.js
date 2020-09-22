const {
  catchAsync,
  AppError,
  sendResponse,
} = require("../helpers/utils.helper");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Shop = require("../models/shop");
const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  let { name, email, password, role } = req.body;
  let user = await User.findOne({ email });
  if (user) return next(new AppError(403, "User already exists"));

  user = await User.create({
    name,
    email,
    password,
    role,
  });
  const accessToken = await user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "User created"
  );
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  let user = await User.findById(userId);
  user = user.toJSON();
  user.shops = await Shop.find({ owner: userId });
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get current user successful"
  );
});

module.exports = userController;
