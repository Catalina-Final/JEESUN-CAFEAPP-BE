const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/review.controller");
const validators = require("../middlewares/validators");
const authMiddleware = require("../middlewares/authentication");
const { body, param } = require("express-validator");

/**
 * @route POST api/shops/:id/reviews
 * @description Create a new review for a shop
 * @access Login required
 * */
router.post(
  "/",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("content", "Missing content").exists().notEmpty(),
    body("rating", "Missing rating").exists().notEmpty(),
  ]),
  reviewController.createNewReview
);

/**
 * @route GET api/shops/:id/reviews?page=1&limit=10
 * @description Get reviews of a shop with a pagination
 * @access Public
 */
router.get(
  "/",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  reviewController.getReviewsOfShop
);

/**
 * @route PUT api/shops/:id/reviews/:id
 * @description Update a review
 * @access Login required
 */
router.put(
  "/:rid",
  authMiddleware.loginRequired,
  validators.validate([
    param("rid").exists().isString().custom(validators.checkObjectId),
    body("content", "Missing content").exists().notEmpty(),
    body("rating", "Missing rating").exists().notEmpty(),
  ]),
  reviewController.updateSingleReview
);

/**
 * @route DELETE api/shops/:id/reviews/:rid
 * @description Delete a review
 * @access Login required
 */
router.delete(
  "/:rid",
  authMiddleware.loginRequired,
  validators.validate([
    param("rid").exists().isString().custom(validators.checkObjectId),
  ]),
  reviewController.deleteSingleReview
);

module.exports = router;
