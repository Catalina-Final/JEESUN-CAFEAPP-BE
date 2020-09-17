const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const Shop = require("./shop");
// const User = require("./user");

const favoriteSchema = Schema({
    add: { type: Schema.ObjectId, required: true, ref: "Shop" },
    to: { type: Schema.ObjectId, required: true, ref: "User" },
    status: {
        type: String,
        enum: ["added", "cancel"],
    },
});

module.exports = mongoose.model("Favorite", favoriteSchema);
