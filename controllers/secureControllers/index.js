const {
  allPendingCharges,
  allPaidCharges,
  sendInvoice,
  getMultipleChargesDetails,
  getSingleChargesDetails,
} = require("./chargesController/chargesController");
const { addClass, allClass } = require("./classController/classController");
const {
  addGameSchedule,
  allGameSchedule,
} = require("./eventsController/gameScheduleController");
const {
  addSeasonalGame,
  allSeasonalGame,
} = require("./eventsController/seasonalGameController");
const {
  addSpecialEvent,
  allSpecialEvent,
} = require("./eventsController/specialEventController");
const {
  addWeeklyTrainingSchedule,
  addCustomTrainingSchedule,
  allWeeklyTrainingSchedule,
  allCustomTrainingSchedule,
} = require("./eventsController/trainingScheduleController");
const {
  allTransactions,
  paidByCashForPlayer,
  getTotalCharge,
  paidByCashForAllPlayerOfSingleGuardian,
} = require("./secure.paymentController");
const {
  addGuardian,
  allGuardian,
  updateGuardian,
  deleteGuardian,
  totalGuardian,
  singleGuardian,
  getAllUnpaidPlayerForGuardian,
} = require("./secure.guardianController");
const {
  addManager,
  allManager,
  updateManager,
  deleteManager,
  singleManager,
  allTeamForSingleManager,
  getRemainingTeamListForManager,
  assignTeamListForManager,
  removeTeamForManager,
} = require("./secure.managerController");
const {
  addPlayer,
  allPlayer,
  updatePlayer,
  deletePlayer,
  totalPlayer,
  latestPlayer,
  addPlayerForGuardian,
  assignTeam,
  singlePlayer,
  allPlayersForGuardian,
  getGuardianFreePlayers,
  assignPlayerToGuardian,
  getAllTeamForPlayer,
  getRemainingTeamList,
  removePlayerFromTeam,
} = require("./secure.playerController");
const {
  addTeam,
  allTeam,
  assignPlayer,
  deleteTeam,
  totalTeam,
  latestTeam,
  singleTeam,
  allTeamForPlayer,
  playerListForAssignIntoteam,
  updateTeam,
} = require("./secure.teamController");
const {
  addTrainer,
  allTrainer,
  updateTrainer,
  deleteTrainer,
  singleTrainer,
  allTeamForSingleTrainer,
  getRemainingTeamListForTrainer,
  removeTeamForTrainer,
  assignTeamListForTrainer,
} = require("./secure.trainerController");
const {
  changeBusinessSetting,
  allBusinessSetting,
  addBusinessSetting,
} = require("./settingController/businessSettingController");
const {
  addCurrency,
  changeCurrency,
  getCurrency,
} = require("./settingController/currencySettingController");
const {
  addDomain,
  addDns,
  AllDns,
  updateDns,
  deleteDns,
  addNs,
  AllNs,
  updateNs,
  deleteNs,
  addCname,
  AllCname,
  updateCname,
  deleteCname,
} = require("./settingController/domainManagementController");
const { addSmtp } = require("./settingController/emailConfigSettingController");
const {
  addStripe,
  addPaypal,
  addSslcommerz,
} = require("./settingController/paymentSettingController");
const {
  addSponsor,
  allSponsor,
} = require("./sponsorController/sponsorController");
const {
  addGameSubscription,
  allGameSubscription,
} = require("./subscriptionController/gameSubscriptionController");
const {
  addPlayerSubscription,
  allPlayerSubscription,
} = require("./subscriptionController/playerSubscriptionController");
const {
  addSeasonalSubscription,
  allSeasonalSubscription,
} = require("./subscriptionController/seasonalSubscriptionController");
const { getUserCountry } = require("./userController/userController");

module.exports = {
  // user
  userCountryController: getUserCountry,
  // guardian
  addGuardianController: addGuardian,
  allGuardianController: allGuardian,
  totalGuardianController: totalGuardian,
  updateGuardianController: updateGuardian,
  deleteGuardianController: deleteGuardian,
  singleGuardianController: singleGuardian,
  getAllUnpaidPlayersForGuardianController: getAllUnpaidPlayerForGuardian,
  // player
  addPlayerController: addPlayer,
  allPlayerController: allPlayer,
  totalPlayerController: totalPlayer,
  latestPlayerController: latestPlayer,
  updatePlayerController: updatePlayer,
  deletePlayerController: deletePlayer,
  addPlayerForGuardianController: addPlayerForGuardian,
  assignTeamController: assignTeam,
  singlePlayerController: singlePlayer,
  allPlayersForGuardianController: allPlayersForGuardian,
  getGuardianFreePlayersController: getGuardianFreePlayers,
  assignPlayerToGuardianController: assignPlayerToGuardian,
  getAllTeamForPlayerController: getAllTeamForPlayer,
  getRemainingTeamListController: getRemainingTeamList,
  removePlayerFromTeamController: removePlayerFromTeam,
  // payment
  allTransactionsController: allTransactions,
  paidByCashForPlayerController: paidByCashForPlayer,
  paidByCashForAllPlayerOfSingleGuardianController:
    paidByCashForAllPlayerOfSingleGuardian,
  getTotalChargeController: getTotalCharge,
  // manager
  addManagerController: addManager,
  allManagerController: allManager,
  updateManagerController: updateManager,
  deleteManagerController: deleteManager,
  singleManagerController: singleManager,
  allTeamForSingleManagerController: allTeamForSingleManager,
  getRemainingTeamListForManagerController: getRemainingTeamListForManager,
  assignTeamListForManagerController: assignTeamListForManager,
  removeTeamForManagerController: removeTeamForManager,
  // trainer
  addTrainerController: addTrainer,
  allTrainerController: allTrainer,
  updateTrainerController: updateTrainer,
  deleteTrainerController: deleteTrainer,
  singleTrainerController: singleTrainer,
  allTeamForSingleTrainerController: allTeamForSingleTrainer,
  getRemainingTeamListForTrainerController: getRemainingTeamListForTrainer,
  removeTeamForTrainerController: removeTeamForTrainer,
  assignTeamListForTrainerController: assignTeamListForTrainer,
  // team
  AddTeamController: addTeam,
  allTeamController: allTeam,
  totalTeamController: totalTeam,
  latestTeamController: latestTeam,
  assignPlayerController: assignPlayer,
  deleteTeamController: deleteTeam,
  singleTeamController: singleTeam,
  allTeamsForPlayerController: allTeamForPlayer,
  playerListForAssignIntoteamController: playerListForAssignIntoteam,
  updateTeamController: updateTeam,
  // game schedule
  addGameSchduleController: addGameSchedule,
  allGameScheduleController: allGameSchedule,
  addSeasonalGameController: addSeasonalGame,
  allSeasonalGameController: allSeasonalGame,
  // training schedule
  addWeeklyTrainingScheduleController: addWeeklyTrainingSchedule,
  addCustomTrainingScheduleController: addCustomTrainingSchedule,
  allWeeklyTrainingScheduleController: allWeeklyTrainingSchedule,
  allCustomTrainingScheduleController: allCustomTrainingSchedule,
  // events
  addSpecialEventController: addSpecialEvent,
  allSpecialEventController: allSpecialEvent,
  // class attendence
  addClassController: addClass,
  allClassController: allClass,
  // sponsor
  addSponsorController: addSponsor,
  allSponsorController: allSponsor,
  // subscription
  addPlayerSubscriptionController: addPlayerSubscription,
  allPlayerSubscriptionController: allPlayerSubscription,
  addSeasonalSubscriptionController: addSeasonalSubscription,
  allSeasonalSubscriptionController: allSeasonalSubscription,
  addGameSubscriptionController: addGameSubscription,
  allGameSubscriptionController: allGameSubscription,
  // charges
  allPendingChargesController: allPendingCharges,
  allPaidChargesController: allPaidCharges,
  sendInvoiceController: sendInvoice,
  getMultipleChargesDetailsController: getMultipleChargesDetails,
  getSingleChargesDetailsController: getSingleChargesDetails,
  // settings
  // business settings
  addBusinessSettingController: addBusinessSetting,
  changeBusinessSettingController: changeBusinessSetting,
  allBusinessSettingController: allBusinessSetting,
  // currency settings
  addCurrencyController: addCurrency,
  chnageCurrencyController: changeCurrency,
  getCurrencyController: getCurrency,
  // domain management
  addDomainController: addDomain,
  addDnsController: addDns,
  allDnsController: AllDns,
  updateDnsController: updateDns,
  deleteDnsController: deleteDns,
  addNsController: addNs,
  allNsController: AllNs,
  updateNsController: updateNs,
  deleteNsController: deleteNs,
  addCnameController: addCname,
  allCnameController: AllCname,
  updateCnameController: updateCname,
  deleteCnameController: deleteCname,
  // payment setting
  addStripeController: addStripe,
  addPaypalController: addPaypal,
  addSslcommerzController: addSslcommerz,
  // email config setting
  addSmtpController: addSmtp,
};
