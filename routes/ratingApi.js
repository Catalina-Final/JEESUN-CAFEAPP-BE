const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");
const ratingController = require("../controllers/rating.controller");

/**
 * @route POST POST api/ratings/shops/:id
 * @description Save a rating to a shop
 * @access Login required
 */
router.post(
  "/shops/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("rating", "Missing rating").exists().notEmpty(),
  ]),
  ratingController.saveRating
);

module.exports = router;
