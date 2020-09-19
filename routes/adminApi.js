const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const validators = require("../middlewares/validators");
const authMiddleware = require("../middlewares/authentication");
const { body, param } = require("express-validator");

/** ---------- shops control ------------ **/

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

/** ---------- events control ------------ **/

/**
 * @route POST api/admin/events
 * @description Create a new event
 * @access Login required, Admin Required
 */
router.post(
  "/events",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  validators.validate([body("title", "Missing title").exists().notEmpty()]),
  adminController.createNewEvent
);

/**
 * @route PUT api/admin/events/:id
 * @description Update single event
 * @access Login required, Admin Required
 */
router.put(
  "/events/:id",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("title", "Missing title").exists().notEmpty(),
    body("owner", "Missing owner").exists().notEmpty(),
  ]),
  adminController.updateSingleEvent
);

/**
 * @route DELETE api/admin/events/:id
 * @description Delete a single event
 * @access Login required, Admin Required
 */
router.delete(
  "/events/:id",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  adminController.deleteSingleEvent
);

/** ---------- review control ------------ **/

/**
 * @route DELETE api/admin/reviews/:id
 * @description Delete a review
 * @access Login required, Admin Required
 */
router.delete(
  "/reviews/:id",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  adminController.deleteSingleReview
);

module.exports = router;
