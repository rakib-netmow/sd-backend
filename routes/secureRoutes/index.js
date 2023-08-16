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
  addGameSchduleController,
  allGameScheduleController,
  addSeasonalGameController,
  allSeasonalGameController,
  addWeeklyTrainingScheduleController,
  addCustomTrainingScheduleController,
  allTrainingScheduleController,
  addSpecialEventController,
  allSpecialEventController,
  addClassController,
  allClassController,
  addSponsorController,
  allSponsorController,
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
router.post("/add_game_schedule", addGameSchduleController);
router.get("/all_game_schedule", allGameScheduleController);
router.post("/add_seasonal_game", addSeasonalGameController);
router.get("/all_seasonal_game", allSeasonalGameController);
router.post(
  "/add_weekly_training_schedule",
  addWeeklyTrainingScheduleController
);
router.post(
  "/add_custom_training_schedule",
  addCustomTrainingScheduleController
);
router.get("/all_training_schedule", allTrainingScheduleController);
router.post("/add_special_event", addSpecialEventController);
router.get("/all_special_event", allSpecialEventController);
router.post("/add_class", addClassController);
router.get("/all_class", allClassController);
router.post("/add_sponsor", addSponsorController);
router.get("/all_sponsor", allSponsorController);

module.exports = router;
