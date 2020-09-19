const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    images: [String],
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Number, required: false },
    time: { type: Number, required: false }, // time ?
    startHour: { type: String, required: true, default: "10am" }, // undefault later
    endHour: { type: String, required: true, default: "6pm" }, // undefault later

    interestedCount: { type: Number, default: 0 },
    // interested: { type: Number, default: 0 },

    phone: { type: String, required: true, default: "84-777-808-430" }, // undefault later
    coords: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: false,
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
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

eventSchema.plugin(require("./plugins/isDeletedFalse"));

module.exports = mongoose.model("Event", eventSchema);
