const express = require("express");
const {
  registerController,
  loginController,
  otpController,
  checkOtpController,
  checkSubdomainController,
} = require("../../controllers/publicControllers");
const {
  registerValidator,
  registerValidatorHandler,
} = require("../../validation");
const router = express.Router();

router.post(
  "/register",
  registerValidator,
  registerValidatorHandler,
  registerController
);
router.post("/login", loginController);
router.post("/otp", otpController);
router.post("/check-otp", checkOtpController);
router.post("/check-subdomain", checkSubdomainController);

module.exports = router;
