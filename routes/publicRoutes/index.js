const express = require("express");
const {
  registerController,
  loginController,
  otpController,
  checkOtpController,
} = require("../../controllers/publicControllers");
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/otp", otpController);
router.post("/check_otp", checkOtpController);

module.exports = router;
