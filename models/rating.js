const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = Schema({
  shop: { type: Schema.ObjectId, required: true, ref: "Shop" },
  reviewer: { type: Schema.ObjectId, required: true, ref: "User" },
  rating: { type: Number, required: true },
});

module.exports = mongoose.model("Rating", ratingSchema);
