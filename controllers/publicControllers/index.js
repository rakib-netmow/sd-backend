const { register, login } = require("./authController/authController");
const sendOtp = require("./otpController/otpController");

module.exports = {
  registerController: register,
  loginController: login,
  otpController: sendOtp,
};
