const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Shop = require("./shop");

const reviewSchema = Schema({
  content: { type: String, required: true },
  shop: { type: Schema.ObjectId, required: true, ref: "Shop" },
  reviewer: { type: Schema.ObjectId, required: true, ref: "User" },
  rating: { type: Number, required: true}, // true later
});

// Calculate Review Count and update in Shop
reviewSchema.statics.calculateReviews = async function (shopId) {
  const reviewCount = await this.find({ shop: shopId }).countDocuments();
  await Shop.findByIdAndUpdate(shopId, { reviewCount: reviewCount });
};

reviewSchema.post("save", async function () {
  // this point to current review
  await this.constructor.calculateReviews(this.shop);
  await this.constructor.calculateRatings(this.shop);
});

// Calculate Rating Average and update in Shop
reviewSchema.statics.calculateRatings = async function (shopId) {
  const ratingNum = await this.find({ shop: shopId }).countDocuments();
  const ratingSum = await this.aggregate([
    { $match: { shop: shopId } },
    { $group: { _id: null, amount: { $sum: "$rating" } } },
  ]);
  // console.log('ratingTotal:', ratingTotal)
  const finalRatings =
    Math.round((ratingSum[0].amount / ratingNum) * 100) / 100;
  await Shop.findByIdAndUpdate(shopId, { ratings: finalRatings });
};

// Neither findByIdAndUpdate norfindByIdAndDelete have access to document middleware.
// They only get access to query middleware
// Inside this hook, this will point to the current query, not the current review.
// Therefore, to access the review, we’ll need to execute the query
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
  await this.doc.constructor.calculateReviews(this.doc.shop);
});

module.exports = mongoose.model("Review", reviewSchema);
