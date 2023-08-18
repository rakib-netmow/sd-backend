const GameSubscription = require("../../../model/subscription/gameSubscriptionModel");

const addGameSubscription = async (req, res) => {
  const { name, image, description } = req.body;
  const created_by = req.auth.id;
  try {
    if (!name) {
      res.status(400).json({
        message: "Name is required!",
      });
    } else if (!description) {
      res.status(400).json({
        message: "Description is required!",
      });
    } else {
      const newGameSubscription = await GameSubscription.create({
        name,
        // image,
        description,
        created_by,
      });
      if (newGameSubscription) {
        res.status(200).json({
          message: "New game subscription added successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can not create new game subscription. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allGameSubscription = async (req, res) => {
  try {
    const created_by = req.auth.id;
    const allGameSubscriptions = await GameSubscription.find({ created_by });
    res.status(200).json(allGameSubscriptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addGameSubscription,
  allGameSubscription,
};
