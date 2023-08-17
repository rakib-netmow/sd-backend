const express = require("express");
const {
  userCountryController,
  addGuardianController,
  allGuardianController,
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
  addPlayerSubscriptionController,
  allPlayerSubscriptionController,
  addSeasonalSubscriptionController,
  allSeasonalSubscriptionController,
  addGameSubscriptionController,
  allGameSubscriptionController,
} = require("../../controllers/secureControllers");
const { verifyAdmin, verifyJWT } = require("../../middleware/authMiddleware");

const router = express.Router();
const middleware = [verifyJWT, verifyAdmin];

router.use(middleware);

router.get("/user-country", userCountryController);
router.post("/add-guardian", addGuardianController);
router.get("/all-guardian", allGuardianController);
router.post("/add-player", addPlayerController);
router.get("/all-player", allPlayerController);
router.post("/add-manager", addManagerController);
router.get("/all-manager", allManagerController);
router.post("/add-trainer", addTrainerController);
router.get("/all-trainer", allTrainerController);
router.post("/add-team", AddTeamController);
router.get("/all-team", allTeamController);
router.post("/add-game-schedule", addGameSchduleController);
router.get("/all-game-schedule", allGameScheduleController);
router.post("/add-seasonal-game", addSeasonalGameController);
router.get("/all-seasonal-game", allSeasonalGameController);
router.post(
  "/add-weekly-training-schedule",
  addWeeklyTrainingScheduleController
);
router.post(
  "/add-custom-training-schedule",
  addCustomTrainingScheduleController
);
router.get("/all-training-schedule", allTrainingScheduleController);
router.post("/add-special-event", addSpecialEventController);
router.get("/all-special-event", allSpecialEventController);
router.post("/add-class", addClassController);
router.get("/all-class", allClassController);
router.post("/add-sponsor", addSponsorController);
router.get("/all-sponsor", allSponsorController);
router.post("/add-player-subscription", addPlayerSubscriptionController);
router.get("/all-player-subscription", allPlayerSubscriptionController);
router.post("/add-seasonal-subscription", addSeasonalSubscriptionController);
router.get("/all-seasonal-subscription", allSeasonalSubscriptionController);
router.post("/add-game-subscription", addGameSubscriptionController);
router.get("/all-game-subscription", allGameSubscriptionController);

module.exports = router;
