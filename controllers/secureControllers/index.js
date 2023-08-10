const { addGaurdian, allGaurdian } = require("./secure.gaurdianController");
const { addManager, allManager } = require("./secure.managerController");
const { addPlayer, allPlayer } = require("./secure.playerController");
const { addTeam, allTeam } = require("./secure.teamController");
const { addTrainer, allTrainer } = require("./secure.trainerController");
const { getUserCountry } = require("./userController/userController");

module.exports = {
  userCountryController: getUserCountry,
  addGaurdianController: addGaurdian,
  allgaurdianController: allGaurdian,
  addPlayerController: addPlayer,
  allPlayerController: allPlayer,
  addManagerController: addManager,
  allManagerController: allManager,
  addTrainerController: addTrainer,
  allTrainerController: allTrainer,
  AddTeamController: addTeam,
  allTeamController: allTeam,
};
