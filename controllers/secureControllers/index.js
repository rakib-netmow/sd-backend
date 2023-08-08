const { addGaurdian, allGaurdian } = require("./secure.gaurdianController");
const { addPlayer, allPlayer } = require("./secure.playerController");
const { getUserCountry } = require("./userController/userController");

module.exports = {
  userCountryController: getUserCountry,
  addGaurdianController: addGaurdian,
  allgaurdianController: allGaurdian,
  addPlayerController: addPlayer,
  allPlayerController: allPlayer,
};
