const { check, validationResult } = require("express-validator");

// login
const loginInput = [
  check("email").notEmpty().withMessage("Email is required"),
  check("password").notEmpty().withMessage("Password is required"),
];

const loginHandler = function (req, res, next) {
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

//           phone,
//           country,

const registerInput = [
  check("email").notEmpty().withMessage("Email is required"),
  check("email").isEmail().withMessage("Invalid Email"),
  check("password").notEmpty().withMessage("Password is required"),
  check("password")
    .isStrongPassword({
      minLength: 7,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage(
      "Password should be minimum length of 8 charactar and should contain lowercase, upercase and number."
    ),
  check("sports_category")
    .notEmpty()
    .withMessage("Sports category is required"),
  check("sports_category")
    .isString()
    .withMessage("Sports category should be a string"),
  check("organisation_name")
    .notEmpty()
    .withMessage("Organisation name is required"),
  check("organisation_name")
    .isString()
    .withMessage("Organisation name should be a string"),
  check("subdomain").notEmpty().withMessage("Subdomain is required"),
  check("subdomain").isString().withMessage("Subdomain should be a string"),
  check("phone").notEmpty().withMessage("Phone number is required"),
  // check("phone")
  //   .isNumeric()
  //   .withMessage("Subdomain should be number"),
  check("country").notEmpty().withMessage("Country is required"),
  check("country").isString().withMessage("Country should be string"),
];

const registerHandler = function (req, res, next) {
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
  loginInput,
  loginHandler,
  registerInput,
  registerHandler,
};
