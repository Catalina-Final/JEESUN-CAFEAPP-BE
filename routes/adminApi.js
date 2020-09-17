const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const validators = require("../middlewares/validators");
const authMiddleware = require("../middlewares/authentication");
const { body, param } = require("express-validator");

/**
 * @route POST api/admin/shops
 * @description Create a new shop
 * @access Login required, Admin Required
 */
router.post(
  "/shops",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  validators.validate([
    body("name", "Missing name").exists().notEmpty(),
    body("owner", "Missing owner").exists().notEmpty(),
  ]),
  adminController.createNewShop
);

/**
 * @route PUT api/admin/shops/:id
 * @description Update s shop
 * @access Login required, Admin Required
 */
router.put(
  "/shops/:id",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("name", "Missing name").exists().notEmpty(),
    // body("owner", "Missing owner").exists().notEmpty(),
  ]),
  adminController.updateSingleShop
);

/**
 * @route DELETE api/admin/shops/:id
 * @description Delete a single shop
 * @access Login required, Admin Required
 */
router.delete(
  "/shops/:id",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  adminController.deleteSingleShop
);

module.exports = router;
