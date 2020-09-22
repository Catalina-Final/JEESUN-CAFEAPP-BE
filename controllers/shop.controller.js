const {
  catchAsync,
  AppError,
  sendResponse,
} = require("../helpers/utils.helper");
const Shop = require("../models/shop");
const User = require("../models/user");
const Review = require("../models/review");
const mongoose = require("mongoose");
const shopController = {};

// 106.707818,
// 10.7619779
// ?queryField=coords&distance=10&latlng=106.707818,10.7619779&unit=mi
shopController.getShops = catchAsync(async (req, res, next) => {
  let { queryField, distance, latlng, unit } = req.query;
  let [lat, lng] = [0, 0];
  let radius;
  if ((queryField, distance, latlng, unit)) {
    [lat, lng] = latlng.split(",");
    radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
  }

  console.log(queryField, distance, latlng, unit);
  let filter = { ...req.query };
  delete filter.limit;
  delete filter.page;
  delete filter.sortBy;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let totalShops;
  if (queryField) {
    totalShops = await Shop.find({
      coords: {
        $geoWithin: { $centerSphere: [[lng, lat], radius] },
      },
    }).countDocuments();
  } else {
    totalShops = await Shop.find(filter).countDocuments();
  }

  const totalPages = Math.ceil(totalShops / limit);
  const offset = limit * (page - 1);

  const sortBy = req.query.sortBy || {};
  if (!sortBy.createdAt) {
    sortBy.createdAt = "desc";
  }

  let shops;
  if (queryField) {
    shops = await Shop.find({
      coords: {
        $geoWithin: { $centerSphere: [[lng, lat], radius] },
      },
    })
      .sort(sortBy)
      .skip(offset)
      .limit(limit)
      .populate("owner");
  } else {
    shops = await Shop.find(filter)
      .sort(sortBy)
      .skip(offset)
      .limit(limit)
      .populate("owner");
  }

  return sendResponse(res, 200, true, { shops, totalPages }, null, "");
});

shopController.getSingleShop = catchAsync(async (req, res, next) => {
  let shop = await Shop.findById(req.params.id).populate("owner");

  if (!shop) return next(new AppError(401, "Shop not found"));
  shop = shop.toJSON();
  shop.reviews = await Review.find({ shop: shop._id }).populate("reviewer");
  return sendResponse(res, 200, true, shop, null, null);
});

// Owner only
shopController.createNewShop = catchAsync(async function (req, res, next) {
  const owner = req.userId;
  console.log(owner);

  const allows = [
    "name",
    "address",
    "phone",
    "tags",
    "coords",
    "images",
    "openHour",
    "closeHour",
    "district",
  ];

  for (let key in req.body) {
    if (!allows.includes(key)) {
      delete req.body[key];
    }
    if (key === "coords") {
      req.body.coords = { type: "Point", coordinates: req.body.coords };
    }
  }
  const shop = await Shop.create({
    ...req.body,
    sortName: req.body.name,
    owner,
  });
  return sendResponse(res, 200, true, shop, null, "A new shop created");
});

shopController.getMyShops = catchAsync(async (req, res, next) => {
  console.log("hahahahhahahahah");
  const owner = req.userId;
  const shops = await Shop.find({ owner });
  return sendResponse(res, 200, true, shops, null, "Here are your shops");
});

// Owner only
shopController.updateSingleShop = catchAsync(async (req, res, next) => {
  const owner = req.userId;
  const shopId = req.params.id;
  const allows = [
    "name",
    "address",
    "phone",
    "tags",
    "coords",
    "images",
    "openHour",
    "closeHour",
    "district",
  ];

  for (let key in req.body) {
    if (!allows.includes(key)) {
      delete req.body[key];
    }
    if (key === "coords") {
      req.body.coords = { type: "Point", coordinates: req.body.coords };
    }
  }

  const shop = await Shop.findOneAndUpdate(
    { _id: shopId, owner: owner },
    {
      ...req.body,
    },
    { new: true }
  );
  if (!shop)
    return next(new AppError(401, "Shop not found or user not authorized"));
  return sendResponse(res, 200, true, shop, null, "Shop updated");
});
// current user = owner
// no admin

// Owner only
shopController.deleteSingleShop = catchAsync(async (req, res, next) => {
  const owner = req.userId;
  const shopId = req.params.id;

  const shop = await Shop.findByIdAndUpdate(
    { _id: shopId, owner: owner },
    { isDeleted: true },
    { new: true }
  );
  if (!shop)
    return next(new AppError(401, "Shop not found or User not authorized"));
  return sendResponse(res, 200, true, null, null, "Shop deleted");
});

shopController.favoriteShop = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const check = await User.findOne({
    _id: req.userId,
    favorites: req.params.id,
  });
  let user;
  if (!check) {
    console.log("like");
    user = await User.findByIdAndUpdate(
      req.userId,
      {
        $addToSet: { favorites: req.params.id },
      },
      { new: true }
    );
  } else {
    console.log("unlike");
    user = await User.findByIdAndUpdate(
      req.userId,
      {
        $pull: { favorites: req.params.id },
      },
      { new: true }
    );
  }
  const foo = await User.find({
    favorites: req.params.id,
  }).countDocuments();
  const shop = await Shop.findByIdAndUpdate(
    req.params.id,
    {
      favoriteUserCount: foo,
    },
    {
      new: true,
    }
  );

  return sendResponse(
    res,
    200,
    true,
    { shop, user },
    null,
    "favorite list updated successfully"
  );
  // update user with favoties array
});

module.exports = shopController;
