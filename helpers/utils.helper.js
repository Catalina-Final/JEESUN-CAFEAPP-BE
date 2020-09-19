"use strict";
const utilsHelper = {};

// This function controls the way we response to the client
// If we need to change the way to response later on, we only need to handle it here
utilsHelper.sendResponse = (
  res,
  status,
  success,
  data,
  errors,
  message,
  token
) => {
  const response = {};
  if (success) response.success = success;
  if (data) response.data = data;
  if (errors) response.errors = errors;
  if (message) response.message = message;
  // if (token) response.token = token;
  return res.status(status).json(response);
};

class AppError extends Error {
  constructor(statusCode, message) {
    super(message); // inherited from built in ERROR class
    this.statusCode = statusCode;
    this.success = `${statusCode}`.startsWith("4") ? false : true;
    // create a stack trace for debugging (Error obj, void obj to avoid stack polution)
    Error.captureStackTrace(this, this.constructor); // => error.stack
  }
}

utilsHelper.catchAsync = (func) => (req, res, next) =>
  // func(req, res, next).catch(next);
  func(req, res, next).catch((err) => next(err));

utilsHelper.AppError = AppError;

module.exports = utilsHelper;
