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
