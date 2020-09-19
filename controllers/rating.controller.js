const utilsHelper = require("../helpers/utils.helper");
const Rating = require("../models/rating");
const Shop = require("../models/shop");
const { catchAsync, AppError, sendResponse } = utilsHelper;
const ratingController = {};

ratingController.saveRating = catchAsync(async (req, res, next) => {
  const reviewer = req.userId;
  const shopId = req.params.id;
  // check if shop exists
  const check = await Shop.exists({ _id: shopId });
  if (!check) {
    return next(new AppError(404, "Shop not found"));
  }

  let rating = req.body.rating && req.body.rating * 1;
  let r = await Rating.findOne({
    shop: shopId,
    reviewer: reviewer,
  });
  if (!r) {
    r = await Rating.create({
      reviewer,
      shop: shopId,
      rating,
    });
  } else {
    r.rating = rating;
    await r.save();
  }

  const shop = await Shop.findById(shopId);

  //   if (!rating) {
  //     await Rating.create({ reviewer, shopId, rating });
  //     message = "Added rating";
  //   } else {
  //     if (rating.rating === rating) {
  //       await Rating.findOneAndDelete({ _id: rating._id });
  //       message = "Removed rating";
  //     } else {
  //       await Rating.findOneAndUpdate({ _id: rating._id }, { rating });
  //       message = "Updated rating";
  //     }
  //   }

  return sendResponse(
    res,
    200,
    true,
    shop,
    null,
    "Create new rating successful"
  );
});
module.exports = ratingController;
