const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const User = require("./user");

const shopSchema = Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    images: [String],
    ratings: { type: Number, default: 0 }, // stactics.calculateRates
    reviewCount: { type: Number, default: 0 },

    tags: [
      {
        type: String,
        required: false, // true later
        enum: ["modern", "traditional", "specialty", "dessert", "brunch"],
      },
    ],
    events: [Date],
    coords: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    longitude: { type: Number, required: true, default: "40" }, // undefault later
    latitude: { type: Number, required: true, default: "-20" }, // undefault later
    address: { type: String, required: true, default: "132 van ban don" }, // undefault later
    district: { type: String, required: true, default: "4" }, // undefault later
    phone: { type: String, required: true, default: "84-777-808-430" }, // undefault later
    openHour: { type: String, required: true, default: "10am" }, // undefault later
    closeHour: { type: String, required: true, default: "6pm" }, // undefault later
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

shopSchema.plugin(require("./plugins/isDeletedFalse"));

module.exports = mongoose.model("Shop", shopSchema);
