const { addClass, allClass } = require("./classController/classController");
const {
  addGameSchedule,
  allGameSchedule,
} = require("./eventsController/events.gameScheduleController");
const {
  addSeasonalGame,
  allSeasonalGame,
} = require("./eventsController/events.seasonalGameController");
const {
  addSpecialEvent,
  allSpecialEvent,
} = require("./eventsController/events.specialEventController");
const {
  addWeeklyTrainingSchedule,
  addCustomTrainingSchedule,
  allTrainingSchedule,
} = require("./eventsController/events.trainingScheduleController");
const { addGuardian, allGuardian } = require("./secure.guardianController");
const { addManager, allManager } = require("./secure.managerController");
const { addPlayer, allPlayer } = require("./secure.playerController");
const { addTeam, allTeam } = require("./secure.teamController");
const { addTrainer, allTrainer } = require("./secure.trainerController");
const {
  addSponsor,
  allSponsor,
} = require("./sponsorController/sponsorController");
const {
  addGameSubscription,
  allGameSubscription,
} = require("./subscriptionController/subscription.gameSubscriptionController");
const {
  addPlayerSubscription,
  allPlayerSubscription,
} = require("./subscriptionController/subscription.playerSubscriptionController");
const {
  addSeasonalSubscription,
  allSeasonalSubscription,
} = require("./subscriptionController/subscription.seasonalSubscriptionController");
const { getUserCountry } = require("./userController/userController");

module.exports = {
  userCountryController: getUserCountry,
  addGuardianController: addGuardian,
  allGuardianController: allGuardian,
  addPlayerController: addPlayer,
  allPlayerController: allPlayer,
  addManagerController: addManager,
  allManagerController: allManager,
  addTrainerController: addTrainer,
  allTrainerController: allTrainer,
  AddTeamController: addTeam,
  allTeamController: allTeam,
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
