const {
  loginInput,
  loginHandler,
  registerInput,
  registerHandler,
} = require("./authInput");

module.exports = {
  loginValidators: loginInput,
  loginValidationHandler: loginHandler,
  registerValidator: registerInput,
  registerValidatorHandler: registerHandler,
};
