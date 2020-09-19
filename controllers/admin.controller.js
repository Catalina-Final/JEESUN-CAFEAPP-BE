const {
  catchAsync,
  AppError,
  sendResponse,
} = require("../helpers/utils.helper");
const User = require("../models/user");
const Shop = require("../models/shop");
const Event = require("../models/event");
const Review = require("../models/review");
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

adminController.createNewEvent = catchAsync(async function (req, res, next) {
  const owner = await User.findOne({
    _id: req.body.owner,
    role: "owner",
  });
  if (!owner) {
    return next(new AppError(401, "User is not the owner"));
  }
  const allows = ["images", "title", "description", "date", "coords"];

  for (let key in req.body) {
    if (!allows.includes(key)) {
      delete req.body[key];
    }
    if (key === "coords") {
      req.body.coords = { type: "Point", coordinates: req.body.coords };
    }
  }

  const event = await Event.create({
    ...req.body,
    owner: owner._id,
  });
  return sendResponse(res, 200, true, event, null, "A new event created");
});

adminController.updateSingleEvent = catchAsync(async (req, res, next) => {
  const owner = await User.findOne({
    _id: req.body.owner,
    role: "owner",
  });
  if (!owner) {
    return next(new AppError(401, "User is not the owner"));
  }
  const eventId = req.params.id;
  const { title } = req.body;

  const event = await Event.findOneAndUpdate(
    { _id: eventId },
    { title },
    { new: true }
  );
  if (!event) return next(new AppError(401, "Event not found"));
  return sendResponse(res, 200, true, event, null, "Event updated");
});

adminController.deleteSingleEvent = catchAsync(async (req, res, next) => {
  const owner = await User.findOne({
    _id: req.body.owner,
    role: "owner",
  });
  if (!owner) {
    return next(new AppError(401, "User is not the owner"));
  }
  const eventId = req.params.id;

  const event = await Event.findByIdAndUpdate(
    { _id: eventId },
    { isDeleted: true },
    { new: true }
  );
  if (!event) return next(new AppError(401, "Event not found"));
  return sendResponse(res, 200, true, null, null, "Event deleted");
});

adminController.deleteSingleReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;

  const review = await Review.findOneAndDelete({
    _id: reviewId,
  });
  if (!review) return next(new AppError(401, "Review not found"));
  return sendResponse(res, 200, true, null, null, "Review deleted");
});

module.exports = adminController;
