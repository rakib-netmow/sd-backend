const PlayerSubscription = require("../../../model/subscription/playerSubscriptionModel");

const addPlayerSubscription = async (req, res) => {
  const { name, fee, for_, end_date, description } = req.body;
  const created_by = req.auth.id;
  try {
    if (!fee) {
      res.status(400).json({
        message: "Fee is required!",
      });
    } else if (!for_) {
      res.status(400).json({
        message: "For field is required!",
      });
    } else if (!end_date) {
      res.status(400).json({
        message: "End date is required!",
      });
    } else if (!description) {
      res.status(400).json({
        message: "Description is required!",
      });
    } else {
      const newPlayersubscription = await PlayerSubscription.create({
        name,
        fee,
        for_,
        end_date,
        description,
        created_by,
      });

      if (newPlayersubscription) {
        res.status(200).json({
          message: "New player subscription is added successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can not create new subscription. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allPlayerSubscription = async (req, res) => {
  try {
    const created_by = req.auth.id;
    const allPlayerSubcriptions = await PlayerSubscription.find({ created_by });
    res.status(200).json(allPlayerSubcriptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addPlayerSubscription,
  allPlayerSubscription,
};
