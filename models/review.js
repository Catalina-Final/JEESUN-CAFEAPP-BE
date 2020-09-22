const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Shop = require("./shop");

const reviewSchema = Schema(
  {
    content: { type: String, required: true },
    shop: { type: Schema.ObjectId, required: true, ref: "Shop" },
    reviewer: { type: Schema.ObjectId, required: true, ref: "User" },
    rating: { type: Number }, // true later
  },
  { timestamps: true }
);

// // Calculate Review Count and update in Shop
// reviewSchema.statics.calculateReviews = async function (shopId) {
//   const reviewCount = await this.find({ shop: shopId }).countDocuments();
//   await Shop.findByIdAndUpdate(shopId, { reviewCount: reviewCount });
// };

// reviewSchema.post("save", async function () {
//   // this point to current review
//   await this.constructor.calculateReviews(this.shop);
// });

// Neither findByIdAndUpdate norfindByIdAndDelete have access to document middleware.
// They only get access to query middleware
// Inside this hook, this will point to the current query, not the current review.
// Therefore, to access the review, we’ll need to execute the query

reviewSchema.statics.calculateRating = async function (shopId) {
  const ratingAvg = await this.aggregate([
    { $match: { shop: shopId } },
    {
      $group: {
        _id: "$shop",
        ratingAvg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  console.log("RatingAverage", ratingAvg);

  const finalAvg = Math.round(ratingAvg[0].ratingAvg || 0);
  const count = ratingAvg[0].count || 0;
  const shop = await mongoose.model("Shop").findByIdAndUpdate(shopId, {
    ratingCount: count,
    avgRatings: finalAvg,
    reviewCount: count,
  });
  console.log(shop);
};

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.findOne();
  next();
});

reviewSchema.post("save", async function () {
  // this point to current rating
  await this.constructor.calculateRating(this.shop);
});

reviewSchema.post(/^findOneAnd/, async function (next) {
  await this.doc.constructor.calculateRating(this.doc.shop);
});

module.exports = mongoose.model("Review", reviewSchema);
