const {
  catchAsync,
  AppError,
  sendResponse,
} = require("../helpers/utils.helper");
const Shop = require("../models/shop");
const shopController = {};

shopController.getShops = catchAsync(async (req, res, next) => {
  let filter = { ...req.query };
  delete filter.limit;
  delete filter.page;
  delete filter.sortBy;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const totalShops = await Shop.find(filter).countDocuments;
  const totalPages = Math.ceil(totalShops / limit);
  const offset = limit * (page - 1);

  const sortBy = req.query.sortBy || {};
  if (!sortBy.createdAt) {
    sortBy.createdAt = "desc";
  }

  const shops = await Shop.find(filter).sort(sortBy).skip(offset).limit(limit);
  // .populate("owner");

  return sendResponse(res, 200, true, { shops, totalPages }, null, "");
});

shopController.getSingleShop = catchAsync(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id).populate("owner");

  if (!shop) return next(new AppError(401, "Shop not found"));

  return sendResponse(res, 200, true, shop, null, null);
});

// Owner only
shopController.createNewShop = catchAsync(async function (req, res, next) {
  const owner = req.userId; ////// const owner = req.userId
  console.log(owner);

  const allows = ["name", "address", "phone", "tags", "coords"];

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
    owner,
  });
  return sendResponse(res, 200, true, shop, null, "A new shop created");
});

// Owner only
shopController.updateSingleShop = catchAsync(async (req, res, next) => {
  const owner = req.userId;
  const shopId = req.params.id;
  const { name } = req.body;

  const shop = await Shop.findOneAndUpdate(
    { _id: shopId, owner: owner },
    { name },
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

module.exports = shopController;