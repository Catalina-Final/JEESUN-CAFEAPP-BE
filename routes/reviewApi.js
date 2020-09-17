const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const validators = require("../middlewares/validators");
const authMiddleware = require("../middlewares/authentication");
const { body, param } = require("express-validator");

/**
 * @route POST api/reviews/shops/:id
 * @description Create a new review for a shop
 * @access Login required
 * */
router.post(
  "/shops/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("content", "Missing content").exists().notEmpty(),
    body("rating", "Missing rating").exists().notEmpty(),
  ]),
  reviewController.createNewReview
);

/**
 * @route GET api/reviews/shops/:id?page=1&limit=10
 * @description Get reviews of a shop with a pagination
 * @access Public
 */
router.get(
  "/shops/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  reviewController.getReviewsOfShop
);

/**
 * @route PUT api/reviews/:id
 * @description Update a review
 * @access Login required
 */
router.put(
  "/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("content", "Missing content").exists().notEmpty(),
    body("rating", "Missing rating").exists().notEmpty(),
  ]),
  reviewController.updateSingleReview
);

/**
 * @route DELETE api/reviews/:id
 * @description Delete a review
 * @access Login required
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  reviewController.deleteSingleReview
);

module.exports = router;
