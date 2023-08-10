const SeasonalGame = require("../../../model/events/seasonalGamesModel");

const addSeasonalGame = async (req, res) => {
  const { name, date, location, fees } = req.body;
  const created_by = req.auth.id;
  try {
    if (!name) {
      res.status(400).json({
        message: "Name is required!",
      });
    } else if (!date) {
      res.status(400).json({
        message: "Date is required!",
      });
    } else if (!location) {
      res.status(400).json({
        message: "Location is required!",
      });
    } else if (!fees) {
      res.status(400).json({
        message: "Fees is required!",
      });
    } else {
      const newSeasonalGame = await SeasonalGame.create({
        name,
        date,
        location,
        fees,
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
