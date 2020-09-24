const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop.controller");
const validators = require("../middlewares/validators");
const authMiddleware = require("../middlewares/authentication");
const { body, param } = require("express-validator");

/**
 * @route GET api/shops?page=1&limit=10
 * @description Get Shops with pagination
 * @access Public
 */
router.get("/", shopController.getShops);

/**
 * @route GET api/shops/me
 * @description Get my shops
 * @access login required
 */
router.get("/me", authMiddleware.loginRequired, shopController.getMyShops);

/**
 * @route GET api/shops/:id
 * @description Get a single shop
 * @access Public
 */
router.get(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  shopController.getSingleShop
);

/**
 * @route POST api/shops
 * @description Create a new shop
 * @access Login required, Owner Required
 */
router.post(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.ownerRequired,
  validators.validate([body("name", "Missing name").exists().notEmpty()]),
  shopController.createNewShop
);

/**
 * @route PUT api/shops/:id
 * @description Update s shop
 * @access Login required, Owner Required
 */
router.put(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.ownerRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("name", "Missing name").exists().notEmpty(),
    body("owner", "Missing owner").exists().notEmpty(),
  ]),
  shopController.updateSingleShop
);

/**
 * @route DELETE api/shops/:id
 * @description Delete a single shop
 * @access Login required, Owner Required
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.ownerRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  shopController.deleteSingleShop
);

/**
 * @route POST api/shops/:id/favorite
 * @description Save, remove favorite list
 * @access Login required
 */
router.post(
  "/:id/favorite",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  shopController.favoriteShop
);

// reviewApi
const reviewApi = require("./reviewApi");
router.use("/:id/reviews", reviewApi);

module.exports = router;
