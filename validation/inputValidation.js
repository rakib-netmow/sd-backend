const { check, validationResult } = require("express-validator");

// login
const loginValidators = [
  check("user_id").notEmpty().withMessage("Sponsor Id is required"),
  check("password").notEmpty().withMessage("Password is required"),
];

const loginValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.send({
      errors: mappedErrors,
    });
  }
};

module.exports = {
  loginValidators,
  loginValidationHandler,
};
