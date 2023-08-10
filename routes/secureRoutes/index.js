const express = require("express");
const {
  userCountryController,
  addGaurdianController,
  allgaurdianController,
  addPlayerController,
  allPlayerController,
  addManagerController,
  allManagerController,
  addTrainerController,
  allTrainerController,
  AddTeamController,
  allTeamController,
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
router.post("/add_manager", addManagerController);
router.get("/all_manager", allManagerController);
router.post("/add_trainer", addTrainerController);
router.get("/all_trainer", allTrainerController);
router.post("/add_team", AddTeamController);
router.get("/all_team", allTeamController);

module.exports = router;
