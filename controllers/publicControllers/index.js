const { register, login } = require("./authController/authController");
const { sendOtp, checkOtp } = require("./otpController/otpController");
const { checkSubdomain } = require("./validationController");

module.exports = {
  registerController: register,
  loginController: login,
  otpController: sendOtp,
  checkOtpController: checkOtp,
  checkSubdomainController: checkSubdomain,
};
