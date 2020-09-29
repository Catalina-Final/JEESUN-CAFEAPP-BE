const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const shopSchema = Schema(
  {
    name: { type: String, required: true },
    sortName: { type: String, trim: true, lowerCase: true },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    images: [String],
    tags: [String],
    ratingCount: { type: Number, default: 0 },
    avgRatings: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: { type: [String] },

    favoriteUserCount: { type: Number, default: 0 },
    favorited: [String],
    events: [Date],
    coords: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // [lng,lat]
        required: true,
      },
    },

    address: { type: String, required: true }, // undefault later
    district: { type: String, required: true }, // undefault later
    phone: { type: String, required: true }, // undefault later
    openHour: { type: String, required: true }, // undefault later
    closeHour: { type: String, required: true }, // undefault later
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

shopSchema.plugin(require("./plugins/isDeletedFalse"));

module.exports = mongoose.model("Shop", shopSchema);
