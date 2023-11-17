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
  addDomainController,
  addDnsController,
  allDnsController,
  updateDnsController,
  deleteDnsController,
  addNsController,
  allNsController,
  updateNsController,
  deleteNsController,
  addCnameController,
  allCnameController,
  updateCnameController,
  deleteCnameController,
  addStripeController,
  addPaypalController,
  addSslcommerzController,
  addSmtpController,
  allTransactionsController,
} = require("../../controllers/secureControllers");
const { verifyAdmin, verifyJWT } = require("../../middleware/authMiddleware");
const multer = require("../../middleware/multer");

const router = express.Router();
const middleware = [verifyJWT, verifyAdmin];

router.use(middleware);

router.get("/user-country", userCountryController);
// Guardian
router.post("/guardian", multer.single("image"), addGuardianController);
router.get("/guardian", allGuardianController);
router.get("/total-guardian", totalGuardianController);
router.patch("/guardian/:id", updateGuardianController);
router.delete("/guardian/:id", deleteGuardianController);
// Player
router.post("/player", multer.single("image"), addPlayerController);
router.get("/player", allPlayerController);
router.get("/total-player", totalPlayerController);
router.get("/latest-player", latestPlayerController);
router.patch("/player/:id", updatePlayerController);
router.delete("/player/:id", deletePlayerController);
// payment
router.get("/transaction", allTransactionsController);

// Manager
router.post("/manager", multer.single("image"), addManagerController);
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
router.post(
  "/add-game-schedule",
  multer.single("image"),
  addGameSchduleController
);
router.get("/all-game-schedule", allGameScheduleController);
// Seasonal Game
router.post(
  "/add-seasonal-game",
  multer.single("image"),
  addSeasonalGameController
);
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
router.post(
  "/add-special-event",
  multer.single("image"),
  addSpecialEventController
);
router.get("/all-special-event", allSpecialEventController);
// Class
router.post("/add-class", addClassController);
router.get("/all-class", allClassController);
// Sponsor
router.post("/add-sponsor", multer.single("image"), addSponsorController);
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
// Domain management
router.post("/domain-name", addDomainController);
router.post("/dns-record", addDnsController);
router.get("/dns-record", allDnsController);
router.patch("/dns-record/:id", updateDnsController);
router.delete("/dns-record/:id", deleteDnsController);
router.post("/ns-record", addNsController);
router.get("/ns-record", allNsController);
router.patch("/ns-record/:id", updateNsController);
router.delete("/ns-record/:id", deleteNsController);
router.post("/cname-record", addCnameController);
router.get("/cname-record", allCnameController);
router.patch("/cname-record/:id", updateCnameController);
router.delete("/cname-record/:id", deleteCnameController);
// payment setting
router.post("/add-stripe", addStripeController);
router.post("/add-paypal", addPaypalController);
router.post("/add-sslcommerz", addSslcommerzController);
// email config setting
router.post("/add-smtp", addSmtpController);

module.exports = router;
