const {
  allPendingCharges,
  allPaidCharges,
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
  allTrainingSchedule,
} = require("./eventsController/trainingScheduleController");
const {
  addGuardian,
  allGuardian,
  updateGuardian,
  deleteGuardian,
  totalGuardian,
} = require("./secure.guardianController");
const {
  addManager,
  allManager,
  updateManager,
  deleteManager,
} = require("./secure.managerController");
const {
  addPlayer,
  allPlayer,
  updatePlayer,
  deletePlayer,
  totalPlayer,
  latestPlayer,
} = require("./secure.playerController");
const {
  addTeam,
  allTeam,
  assignPlayer,
  deleteTeam,
  totalTeam,
  latestTeam,
} = require("./secure.teamController");
const {
  addTrainer,
  allTrainer,
  updateTrainer,
  deleteTrainer,
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
  // player
  addPlayerController: addPlayer,
  allPlayerController: allPlayer,
  totalPlayerController: totalPlayer,
  latestPlayerController: latestPlayer,
  updatePlayerController: updatePlayer,
  deletePlayerController: deletePlayer,
  // manager
  addManagerController: addManager,
  allManagerController: allManager,
  updateManagerController: updateManager,
  deleteManagerController: deleteManager,
  // trainer
  addTrainerController: addTrainer,
  allTrainerController: allTrainer,
  updateTrainerController: updateTrainer,
  deleteTrainerController: deleteTrainer,
  // team
  AddTeamController: addTeam,
  allTeamController: allTeam,
  totalTeamController: totalTeam,
  latestTeamController: latestTeam,
  assignPlayerController: assignPlayer,
  deleteTeamController: deleteTeam,
  // game schedule
  addGameSchduleController: addGameSchedule,
  allGameScheduleController: allGameSchedule,
  addSeasonalGameController: addSeasonalGame,
  allSeasonalGameController: allSeasonalGame,
  // training schedule
  addWeeklyTrainingScheduleController: addWeeklyTrainingSchedule,
  addCustomTrainingScheduleController: addCustomTrainingSchedule,
  allTrainingScheduleController: allTrainingSchedule,
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
