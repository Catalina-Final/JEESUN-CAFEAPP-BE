// const mongoose = require("mongoose");
// const Rating = require("./rating");
// const Schema = mongoose.Schema;

// const ratingSchema = Schema({
//   shop: { type: Schema.ObjectId, required: true, ref: "Shop" },
//   reviewer: { type: Schema.ObjectId, required: true, ref: "User" },
//   rating: { type: Number, required: true },
// });
// //
// ratingSchema.statics.calculateRating = async function (shopId) {
//   const ratingAvg = await this.aggregate([
//     { $match: { shop: shopId } },
//     {
//       $group: {
//         _id: "$shop",
//         ratingAvg: { $avg: "$rating" },
//         count: { $sum: 1 },
//       },
//     },
//   ]);
//   console.log(ratingAvg);

//   const finalAvg = Math.round(ratingAvg[0].ratingAvg || 0);
//   const count = ratingAvg[0].count || 0;
//   await mongoose.model("Shop").findByIdAndUpdate(shopId, {
//     ratingCount: count,
//     avgRatings: finalAvg,
//   });
// };

// ratingSchema.post("save", async function () {
//   // this point to current rating
//   await this.constructor.calculateRating(this.shop);
// });
// module.exports = mongoose.model("Rating", ratingSchema);
