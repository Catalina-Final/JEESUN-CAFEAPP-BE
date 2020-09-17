const utilsHelper = require("../helpers/utils.helper");
const mongoose = require("mongoose");
//install npm i express-validator
const { validationResult } = require("express-validator");
const validators = {};

validators.validate = (validationArray) => async (req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  console.log(errors);
  const extractedError = [];
  errors
    .array()
    .map((error) => extractedError.push({ [error.param]: error.msg }));
  return utilsHelper.sendResponse(
    res,
    422,
    false,
    null,
    extractedError,
    "Validation Error"
  );
};

validators.checkObjectId = (paramId) => {
  if (!mongoose.Types.ObjectId.isValid(paramId)) {
    throw new Error("Invalid ObjectId");
  }
  return true;
};

module.exports = validators;
