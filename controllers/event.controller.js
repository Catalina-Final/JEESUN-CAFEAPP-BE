const {
  catchAsync,
  AppError,
  sendResponse,
} = require("../helpers/utils.helper");
const Shop = require("../models/shop");
const User = require("../models/user");
const Event = require("../models/event");
const mongoose = require("mongoose");
const moment = require("moment");
const eventController = {};

eventController.getEvents = catchAsync(async (req, res, next) => {
  let filter = { ...req.query };
  const events = await Event.find(filter);

  return sendResponse(res, 200, true, events, null, "");
});

eventController.getSingleEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate("owner")
    .populate("shop");

  if (!event) return next(new AppError(401, "Event not found"));

  return sendResponse(res, 200, true, event, null, null);
});

// Owner only
eventController.createNewEvent = catchAsync(async function (req, res, next) {
  const owner = req.userId;
  // const shop = req.ownerId;
  console.log(owner);

  const allows = [
    "images",
    "shop",
    // "owner",
    "title",
    "description",
    "date",
    "startHour",
    "endHour",
    "address",
    "coords",
    "phone",
  ];

  for (let key in req.body) {
    if (!allows.includes(key)) {
      delete req.body[key];
    }
    if (key === "coords") {
      req.body.coords = { type: "Point", coordinates: req.body.coords };
    }
  }
  let timestamp = req.body.startHour.split(":").map((s) => Number(s));
  const start = moment(req.body.date)
    .add(timestamp[0], "h")
    .add(timestamp[1], "m");
  timestamp = req.body.endHour.split(":").map((s) => Number(s));
  const end = moment(req.body.date)
    .add(timestamp[0], "h")
    .add(timestamp[1], "m");
  const event = await Event.create({
    ...req.body,
    start,
    end,
    owner,
  });
  return sendResponse(res, 200, true, event, null, "A new event created");
});

// Owner only
eventController.updateSingleEvent = catchAsync(async (req, res, next) => {
  const owner = req.userId;
  const eventId = req.params.id;
  const allows = [
    "images",
    "shop",
    // "owner",
    "title",
    "description",
    "date",
    "coords",
    "startHour",
    "endHour",
    "address",
    "phone",
  ];
  // const { title } = req.body;

  for (let key in req.body) {
    if (!allows.includes(key)) {
      delete req.body[key];
    }
    if (key === "coords") {
      req.body.coords = { type: "Point", coordinates: req.body.coords };
    }
  }
  let timestamp = req.body.startHour.split(":").map((s) => Number(s));
  const start = moment(req.body.date)
    .add(timestamp[0], "h")
    .add(timestamp[1], "m");
  timestamp = req.body.endHour.split(":").map((s) => Number(s));
  const end = moment(req.body.date)
    .add(timestamp[0], "h")
    .add(timestamp[1], "m");

  const event = await Event.findOneAndUpdate(
    { _id: eventId, owner: owner },
    { ...req.body },
    { new: true }
  );
  if (!event)
    return next(new AppError(401, "Event not found or user not authorized"));
  return sendResponse(res, 200, true, event, null, "Event updated");
});

// Owner only
eventController.deleteSingleEvent = catchAsync(async (req, res, next) => {
  const owner = req.userId;
  const eventId = req.params.id;

  const event = await Event.findByIdAndUpdate(
    { _id: eventId, owner: owner },
    { isDeleted: true },
    { new: true }
  );
  if (!event)
    return next(new AppError(401, "Event not found or User not authorized"));
  return sendResponse(res, 200, true, null, null, "Event deleted");
});

eventController.interestedEvent = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const check = await User.findOne({
    _id: req.userId,
    interested: req.params.id,
  });
  let user;
  if (!check) {
    // console.log("like");
    user = await User.findByIdAndUpdate(
      req.userId,
      {
        $addToSet: { interested: req.params.id },
      },
      { new: true }
    );
  } else {
    // console.log("unlike");
    user = await User.findByIdAndUpdate(
      req.userId,
      {
        $pull: { interested: req.params.id },
      },
      { new: true }
    );
  }
  const countNum = await User.find({
    interested: req.params.id,
  }).countDocuments();

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    {
      interestedCount: countNum,
    },
    {
      new: true,
    }
  );

  return sendResponse(
    res,
    200,
    true,
    { event, user },
    null,
    "interested status updated successfully"
  );
  // update user with interested array
});

module.exports = eventController;
