const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const validators = require("../middlewares/validators");
const authMiddleware = require("../middlewares/authentication");
const { body, param } = require("express-validator");

/**
 * @route GET api/events
 * @description Get events in calender
 * @access Public
 */
router.get("/", eventController.getEvents);

/**
 * @route GET api/events/:id
 * @description Get a single event
 * @access Public
 */
router.get(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  eventController.getSingleEvent
);

/**
 * @route POST api/events
 * @description Create a new event
 * @access Login required, Owner Required
 */
router.post(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.ownerRequired,
  validators.validate([body("title", "Missing title").exists().notEmpty()]),
  eventController.createNewEvent
);

/**
 * @route PUT api/events/:id
 * @description Update an event
 * @access Login required, Owner Required
 */
router.put(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.ownerRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("title", "Missing title").exists().notEmpty(),
    // body("owner", "Missing owner").exists().notEmpty(),
  ]),
  eventController.updateSingleEvent
);

/**
 * @route DELETE api/events/:id
 * @description Delete a single event
 * @access Login required, Owner Required
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.ownerRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  eventController.deleteSingleEvent
);

/**
 * @route POST api/events/interested/:id
 * @description Save, remove intersted list
 * @access Login required
 */
router.post(
  "/interested/:id",
  authMiddleware.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  eventController.interestedEvent
);

module.exports = router;
