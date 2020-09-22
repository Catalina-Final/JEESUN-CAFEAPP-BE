var express = require("express");
var router = express.Router();

// authApi
const authApi = require("./authApi");
router.use("/auth", authApi);

// userApi
const userApi = require("./userApi");
router.use("/users", userApi);

// shopApi
const shopApi = require("./shopApi");
router.use("/shops", shopApi);

// adminApi
const adminApi = require("./adminApi");
router.use("/admin", adminApi);

// // ratingApi
// const ratingApi = require("./ratingApi");
// router.use("/ratings", ratingApi);

// eventApi
const eventApi = require("./eventApi");
router.use("/events", eventApi);

module.exports = router;
