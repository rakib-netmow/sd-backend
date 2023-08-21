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
} = require("./secure.playerController");
const {
  addTeam,
  allTeam,
  assignPlayer,
  deleteTeam,
} = require("./secure.teamController");
const {
  addTrainer,
  allTrainer,
  updateTrainer,
  deleteTrainer,
} = require("./secure.trainerController");
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
  userCountryController: getUserCountry,
  addGuardianController: addGuardian,
  allGuardianController: allGuardian,
  updateGuardianController: updateGuardian,
  deleteGuardianController: deleteGuardian,
  addPlayerController: addPlayer,
  allPlayerController: allPlayer,
  updatePlayerController: updatePlayer,
  deletePlayerController: deletePlayer,
  addManagerController: addManager,
  allManagerController: allManager,
  updateManagerController: updateManager,
  deleteManagerController: deleteManager,
  addTrainerController: addTrainer,
  allTrainerController: allTrainer,
  updateTrainerController: updateTrainer,
  deleteTrainerController: deleteTrainer,
  AddTeamController: addTeam,
  allTeamController: allTeam,
  assignPlayerController: assignPlayer,
  deleteTeamController: deleteTeam,
  addGameSchduleController: addGameSchedule,
  allGameScheduleController: allGameSchedule,
  addSeasonalGameController: addSeasonalGame,
  allSeasonalGameController: allSeasonalGame,
  addWeeklyTrainingScheduleController: addWeeklyTrainingSchedule,
  addCustomTrainingScheduleController: addCustomTrainingSchedule,
  allTrainingScheduleController: allTrainingSchedule,
  addSpecialEventController: addSpecialEvent,
  allSpecialEventController: allSpecialEvent,
  addClassController: addClass,
  allClassController: allClass,
  addSponsorController: addSponsor,
  allSponsorController: allSponsor,
  addPlayerSubscriptionController: addPlayerSubscription,
  allPlayerSubscriptionController: allPlayerSubscription,
  addSeasonalSubscriptionController: addSeasonalSubscription,
  allSeasonalSubscriptionController: allSeasonalSubscription,
  addGameSubscriptionController: addGameSubscription,
  allGameSubscriptionController: allGameSubscription,
};
