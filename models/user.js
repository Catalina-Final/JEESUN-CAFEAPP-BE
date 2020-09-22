const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["customer", "owner", "admin"],
      default: "customer",
    },
    favorites: [{ type: Schema.ObjectId, required: true, ref: "Shop" }],
    favoriteCount: { type: Number, default: 0 },

    interested: [{ type: Schema.ObjectId, required: true, ref: "Event" }],

    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("shops", {
  ref: "Shop",
  localField: "_id",
  foreignField: "owner",
});

userSchema.plugin(require("./plugins/isDeletedFalse"));

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
