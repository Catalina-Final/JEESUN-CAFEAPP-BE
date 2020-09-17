const {
  catchAsync,
  AppError,
  sendResponse,
} = require("../helpers/utils.helper");
const User = require("../models/user");
const Shop = require("../models/shop");

const adminController = {};

adminController.createNewShop = catchAsync(async (req, res, next) => {
  const allows = ["name"];

  // req.body.owner =>  this gonna be an user_id (for owner) send from frontend and this id has to be an owner

  // make sure req.body.owner is a user && is an owner
  const owner = await User.findOne({
    _id: req.body.owner,
    role: "owner",
  });

  if (!owner) {
    return next(new AppError(401, "User is not the owner"));
  }
  // current user === admin
  // owner
  // admin === current user

  for (let key in req.body) {
    if (!allows.includes(key)) {
      delete req.body[key];
    }
  }
  const shop = await Shop.create({
    ...req.body,
    owner: owner._id,
  });
  return sendResponse(res, 200, true, shop, null, "A new shop created");
});

// check current user is admin if not -> error msg (in middleware)
// if yes, need to check there is name and owner in req.body
// check req.body.owner is a user && an owner

adminController.updateSingleShop = catchAsync(async (req, res, next) => {
  //   const owner = await User.findOne({ _id: req.body.owner, role: "owner" });
  const shopId = req.params.id;
  const { name } = req.body;

  //   if (!owner) {
  //     return next(new AppError(401, "User is not the owner"));
  //   }

  const shop = await Shop.findOneAndUpdate(
    { _id: shopId },
    { name },
    { new: true }
  );
  if (!shop)
    return next(new AppError(401, "Shop not found or user not authorized"));
  return sendResponse(res, 200, true, shop, null, "Shop updated");
});

adminController.deleteSingleShop = catchAsync(async (req, res, next) => {
  //   const owner = await User.findOne({ _id: req.body.owner, role: "owner" });
  const shopId = req.params.id;

  const shop = await Shop.findByIdAndUpdate(
    { _id: shopId },
    { isDeleted: true },
    { new: true }
  );
  if (!shop)
    return next(new AppError(401, "Shop not found or User not authorized"));
  return sendResponse(res, 200, true, null, null, "Shop deleted");
});

module.exports = adminController;
