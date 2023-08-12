const SeasonalGame = require("../../../model/events/seasonalGamesModel");

const addSeasonalGame = async (req, res) => {
  const {
    name,
    vanue,
    // image,
    description,
    starts,
    ends,
    notification,
    fees,
    visible_to,
  } = req.body;
  const created_by = req.auth.id;
  try {
    if (!name) {
      res.status(400).json({
        message: "Name is required!",
      });
    } else if (!starts) {
      res.status(400).json({
        message: "Starts Time is required!",
      });
    } else if (!ends) {
      res.status(400).json({
        message: "Ends Time is required!",
      });
    } else if (!vanue) {
      res.status(400).json({
        message: "Location is required!",
      });
    } else if (!fees) {
      res.status(400).json({
        message: "Fees is required!",
      });
    } else if (!description) {
      res.status(400).json({
        message: "Description is required!",
      });
    } else if (!notification) {
      res.status(400).json({
        message: "Notification is required!",
      });
    } else if (!visible_to) {
      res.status(400).json({
        message: "Visible option is required!",
      });
    } else {
      const newSeasonalGame = await SeasonalGame.create({
        name,
        vanue,
        description,
        starts,
        ends,
        notification,
        fees,
        visible_to,
        created_by,
      });
      if (newSeasonalGame) {
        res.status(200).json({
          message: "New seasonal game added successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can not add new seasonal game. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allSeasonalGame = async (req, res) => {
  try {
    const created_by = req.auth.id;

    const allSeasonalGames = await SeasonalGame.find({ created_by });
    res.status(200).json(allSeasonalGames);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addSeasonalGame,
  allSeasonalGame,
};
