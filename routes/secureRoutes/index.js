const express = require("express");
const {
  userCountryController,
  addGaurdianController,
  allgaurdianController,
  addPlayerController,
  allPlayerController,
} = require("../../controllers/secureControllers");
const { verifyAdmin, verifyJWT } = require("../../middleware/authMiddleware");

const router = express.Router();
const middleware = [verifyJWT, verifyAdmin];

router.use(middleware);

router.get("/user_country", userCountryController);
router.post("/add_guardian", addGaurdianController);
router.get("/all_guardian", allgaurdianController);
router.post("/add_player", addPlayerController);
router.get("/all_player", allPlayerController);

module.exports = router;
