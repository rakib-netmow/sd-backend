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
  allWeeklyTrainingScheduleController,
  allCustomTrainingScheduleController,
  addPlayerForGuardianController,
  assignTeamController,
  singleGuardianController,
  singlePlayerController,
  singleTeamController,
  allPlayersForGuardianController,
  allTeamsForPlayerController,
  getGuardianFreePlayersController,
  assignPlayerToGuardianController,
  getAllTeamForPlayerController,
  getRemainingTeamListController,
  removePlayerFromTeamController,
  playerListForAssignIntoteamController,
  singleManagerController,
  singleTrainerController,
  allTeamForSingleManagerController,
  getRemainingTeamListForManagerController,
  assignTeamListForManagerController,
  removeTeamForManagerController,
  allTeamForSingleTrainerController,
  removeTeamForTrainerController,
  assignTeamListForTrainerController,
  getRemainingTeamListForTrainerController,
  updateTeamController,
  paidByCashForPlayerController,
  getTotalChargeController,
  paidByCashForAllPlayerOfSingleGuardianController,
  getAllUnpaidPlayersForGuardianController,
  sendInvoiceController,
  getMultipleChargesDetailsController,
  getSingleChargesDetailsController,
  singlePaidChargesDetailsController,
  allPaidChargesDetailsController,
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
router.patch("/guardian/:id", multer.single("image"), updateGuardianController);
router.delete("/guardian/:id", deleteGuardianController);
router.get("/guardian/:id", singleGuardianController);
router.get("/all-unpaid-player/:id", getAllUnpaidPlayersForGuardianController);
// Player
router.post("/player", multer.single("image"), addPlayerController);
router.get("/player", allPlayerController);
router.get("/total-player", totalPlayerController);
router.get("/latest-player", latestPlayerController);
router.patch("/player/:id", multer.single("image"), updatePlayerController);
router.delete("/player/:id", deletePlayerController);
router.post(
  "/add-player-for-guardian/:id",
  multer.single("image"),
  addPlayerForGuardianController
);
router.post("/assign-team/:id", assignTeamController);
router.get("/player/:id", singlePlayerController);
router.get("/all-players-for-guardian/:id", allPlayersForGuardianController);
router.get("/guardian-free-players", getGuardianFreePlayersController);
router.put("/assign-player-to-guardian/:id", assignPlayerToGuardianController);
router.get("/all-team-for-player/:id", getAllTeamForPlayerController);
router.get("/all-remain-team-for-player/:id", getRemainingTeamListController);
router.put("/remove-team-from-player/:id", removePlayerFromTeamController);
// payment
router.get("/transaction", allTransactionsController);
router.post("/paid-by-cash/:id", paidByCashForPlayerController);
router.post(
  "/paid-by-cash-for-all-player/:id",
  paidByCashForAllPlayerOfSingleGuardianController
);
router.get("/get-total-charge", getTotalChargeController);

// Manager
router.post("/manager", multer.single("image"), addManagerController);
router.get("/manager", allManagerController);
router.get("/manager/:id", singleManagerController);
router.patch("/manager/:id", multer.single("image"), updateManagerController);
router.delete("/manager/:id", deleteManagerController);
router.get("/all-team-for-manager/:id", allTeamForSingleManagerController);
router.get(
  "/all-remain-team-for-manager/:id",
  getRemainingTeamListForManagerController
);
router.put("/assign-team-to-manager/:id", assignTeamListForManagerController);
router.put("/remove-team-from-manager/:id", removeTeamForManagerController);
//Trainer
router.post("/trainer", multer.single("image"), addTrainerController);
router.get("/trainer", allTrainerController);
router.get("/trainer/:id", singleTrainerController);
router.patch("/trainer/:id", multer.single("image"), updateTrainerController);
router.delete("/trainer/:id", deleteTrainerController);
router.get("/all-team-for-trainer/:id", allTeamForSingleTrainerController);
router.get(
  "/all-remain-team-for-trainer/:id",
  getRemainingTeamListForTrainerController
);
router.put("/remove-team-from-trainer/:id", removeTeamForTrainerController);
router.put("/assign-team-to-trainer/:id", assignTeamListForTrainerController);
// Team
router.post("/team", multer.single("image"), AddTeamController);
router.get("/team", allTeamController);
router.patch("/team/:id", multer.single("image"), updateTeamController);
router.get("/total-team", totalTeamController);
router.get("/latest-team", latestTeamController);
router.post("/assign-player/:id", assignPlayerController);
router.delete("/team/:id", deleteTeamController);
router.get("/team/:id", singleTeamController);
router.get(
  "/player-list-for-assign-in-team/:id",
  playerListForAssignIntoteamController
);
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
router.get(
  "/all-weekly-training-schedule",
  allWeeklyTrainingScheduleController
);
router.get(
  "/all-custom-training-schedule",
  allCustomTrainingScheduleController
);
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
router.post("/send-invoice", sendInvoiceController);
router.get(
  "/multiple-charges-details/:id",
  getMultipleChargesDetailsController
);
router.get("/single-charges-details/:id", getSingleChargesDetailsController);
router.get(
  "/single-paid-charges-details/:id",
  singlePaidChargesDetailsController
);
router.get(
  "/multiple-paid-charges-details/:id",
  allPaidChargesDetailsController
);
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
