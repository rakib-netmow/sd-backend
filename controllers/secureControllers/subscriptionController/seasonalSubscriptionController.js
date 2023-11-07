const SeasonalSubscription = require("../../../model/subscription/seasonalSubscriptionModel");

const addSeasonalSubscription = async (req, res) => {
  const { name, fee, create_date, end_date, description } = req.body;
  const created_by = req.auth.id;
  try {
    if (!name) {
      res.status(400).json({
        message: "Name is required!",
      });
    } else if (!fee) {
      res.status(400).json({
        message: "Fee is required!",
      });
    } else if (!create_date) {
      res.status(400).json({
        message: "Created date is required!",
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
      const newSeasonalSubscription = await SeasonalSubscription.create({
        name,
        fee,
        create_date,
        end_date,
        description,
        created_by,
      });

      if (newSeasonalSubscription) {
        res.status(200).json({
          message: "New seasonal subscription added successfully.",
        });
      } else {
        res.status(400).json({
          message:
            "Can not create new seasonal subscription. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allSeasonalSubscription = async (req, res) => {
  try {
    const created_by = req.auth.id;
    const allSeasonalSubscriptions = await SeasonalSubscription.find({
      created_by,
    });
    res.status(200).json(allSeasonalSubscriptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addSeasonalSubscription,
  allSeasonalSubscription,
};
