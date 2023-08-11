const { register, login } = require("./authController/authController");
const { sendOtp, checkOtp } = require("./otpController/otpController");

module.exports = {
  registerController: register,
  loginController: login,
  otpController: sendOtp,
  checkOtpController: checkOtp,
};
