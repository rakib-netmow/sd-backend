const express = require("express");
const {
  registerController,
  loginController,
  otpController,
} = require("../../controllers/publicControllers");
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/otp", otpController);

module.exports = router;
