const { validationResult } = require("express-validator");

const getUniqueErrors = (errors) => {
  const uniqueErrors = {};
  errors.forEach((error) => {
    if (!uniqueErrors[error.path]) {
      uniqueErrors[error.path] = error.msg;
    }
  });
  return uniqueErrors;
};
exports.validateMiddleWare = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ success: false, message: getUniqueErrors(errors.array()) });
  }
  next();
};
