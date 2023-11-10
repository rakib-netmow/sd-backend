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
  updateGuardianController,
  deleteGuardianController,
  updatePlayerController,
  deletePlayerController,
  updateManagerController,
  deleteManagerController,
  updateTrainerController,
  deleteTrainerController,
  assignPlayerController,
  deleteTeamController,
  totalTeamController,
  totalPlayerController,
  totalGuardianController,
  latestPlayerController,
  latestTeamController,
  allPendingChargesController,
  allPaidChargesController,
  changeBusinessSettingController,
  allBusinessSettingController,
  addBusinessSettingController,
  addCurrencyController,
  chnageCurrencyController,
  getCurrencyController,
} = require("../../controllers/secureControllers");
const { verifyAdmin, verifyJWT } = require("../../middleware/authMiddleware");

const router = express.Router();
const middleware = [verifyJWT, verifyAdmin];

router.use(middleware);

router.get("/user-country", userCountryController);
// Guardian
router.post("/guardian", addGuardianController);
router.get("/guardian", allGuardianController);
router.get("/total-guardian", totalGuardianController);
router.patch("/guardian/:id", updateGuardianController);
router.delete("/guardian/:id", deleteGuardianController);
// Player
router.post("/player", addPlayerController);
router.get("/player", allPlayerController);
router.get("/total-player", totalPlayerController);
router.get("/latest-player", latestPlayerController);
router.patch("/player/:id", updatePlayerController);
router.delete("/player/:id", deletePlayerController);
// Manager
router.post("/manager", addManagerController);
router.get("/manager", allManagerController);
router.patch("/manager/:id", updateManagerController);
router.delete("/manager/:id", deleteManagerController);
//Trainer
router.post("/trainer", addTrainerController);
router.get("/trainer", allTrainerController);
router.patch("/trainer/:id", updateTrainerController);
router.delete("/trainer/:id", deleteTrainerController);
// Team
router.post("/team", AddTeamController);
router.get("/team", allTeamController);
router.get("/total-team", totalTeamController);
router.get("/latest-team", latestTeamController);
router.post("/assign-player/:id", assignPlayerController);
router.delete("/team/:id", deleteTeamController);
// Game Schedule
router.post("/add-game-schedule", addGameSchduleController);
router.get("/all-game-schedule", allGameScheduleController);
// Seasonal Game
router.post("/add-seasonal-game", addSeasonalGameController);
router.get("/all-seasonal-game", allSeasonalGameController);
// Training Schedule
router.post(
  "/add-weekly-training-schedule",
  addWeeklyTrainingScheduleController
);
router.post(
  "/add-custom-training-schedule",
  addCustomTrainingScheduleController
);
router.get("/all-training-schedule", allTrainingScheduleController);
// Special Event
router.post("/add-special-event", addSpecialEventController);
router.get("/all-special-event", allSpecialEventController);
// Class
router.post("/add-class", addClassController);
router.get("/all-class", allClassController);
// Sponsor
router.post("/add-sponsor", addSponsorController);
router.get("/all-sponsor", allSponsorController);
// Player Subscription
router.post("/add-player-subscription", addPlayerSubscriptionController);
router.get("/all-player-subscription", allPlayerSubscriptionController);
// Seasonal Subscription
router.post("/add-seasonal-subscription", addSeasonalSubscriptionController);
router.get("/all-seasonal-subscription", allSeasonalSubscriptionController);
// Game Subscription
router.post("/add-game-subscription", addGameSubscriptionController);
router.get("/all-game-subscription", allGameSubscriptionController);
// charges
router.get("/pending-charges-list", allPendingChargesController);
router.get("/paid-charges-list", allPaidChargesController);
// settings
// business setting
router.post("/company-information", addBusinessSettingController);
router.patch("/company-information", changeBusinessSettingController);
router.get("/company-information", allBusinessSettingController);
// currency setting
router.post("/currency", addCurrencyController);
router.patch("/currency", chnageCurrencyController);
router.get("/currency", getCurrencyController);

module.exports = router;
