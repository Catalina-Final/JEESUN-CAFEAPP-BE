const utilsHelper = require("../helpers/utils.helper");
const Review = require("../models/review");
const review = require("../models/review");
const { catchAsync, AppError, sendResponse } = utilsHelper;
const reviewController = {};

reviewController.createNewReview = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const shopId = req.params.id;
  const { content, rating } = req.body;

  const review = await Review.create({
    reviewer: userId,
    shop: shopId,
    content,
    rating,
  });

  return sendResponse(
    res,
    200,
    true,
    review,
    null,
    "Create new review successful"
  );
});

reviewController.getReviewsOfShop = catchAsync(async (req, res, next) => {
  const shopId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const totalReviews = await Review.countDocuments();
  const totalPages = Math.ceil(totalReviews / limit);
  offset = limit * (page - 1);

  const reviews = await Review.find({ shop: shopId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
  return sendResponse(res, 200, true, { reviews, totalPages }, null, "");
});

reviewController.updateSingleReview = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const reviewId = req.params.id;
  const { content, rating } = req.body;

  const review = await Review.findOneAndUpdate(
    { _id: reviewId, reviewer: userId },
    { content, rating },
    { new: true }
  );
  if (!review)
    return next(new AppError(401, "Review not found or User not authorized"));
  return sendResponse(res, 200, true, review, null, "Revies updated");
});

reviewController.deleteSingleReview = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const reviewId = req.params.id;

  const review = await Review.findOneAndDelete({
    _id: reviewId,
    reviewer: userId,
  });
  if (!review)
    return next(new AppError(401, "Review not found or User not authorized"));
  return sendResponse(res, 200, true, null, null, "Review deleted");
});

module.exports = reviewController;
