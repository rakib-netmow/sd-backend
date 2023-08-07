const express = require("express");
const {
  userCountryController,
} = require("../../controllers/secureControllers");
const { verifyAdmin, verifyJWT } = require("../../middleware/authMiddleware");

const router = express.Router();
const middleware = [verifyJWT, verifyAdmin];

router.use(middleware);

router.get("/user_country", userCountryController);

module.exports = router;
