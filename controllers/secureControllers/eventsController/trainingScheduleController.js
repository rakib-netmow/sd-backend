const CustomTrainingSchedule = require("../../../model/events/customTrainingSchedule");
const WeeklyTrainingSchedule = require("../../../model/events/weeklyTrainingSchedule");

const addWeeklyTrainingSchedule = async (req, res) => {
  const { name, team, day, vanue, from, to, status } = req.body;
  const created_by = req.auth.id;
  try {
    if (!name) {
      res.status(400).json({
        message: "Name is missing!",
      });
    } else if (!team) {
      res.status(400).json({
        message: "Team is missing!",
      });
    } else if (!day) {
      res.status(400).json({
        message: "Day is missing!",
      });
    } else if (!vanue) {
      res.status(400).json({
        message: "Vanue is missing!",
      });
    } else if (!from) {
      res.status(400).json({
        message: "From (start time) is missing!",
      });
    } else if (!to) {
      res.status(400).json({
        message: "To (ends time) is missing!",
      });
    } else if (!status) {
      res.status(400).json({
        message: "Status is missing!",
      });
    } else if (
      status &&
      (status.toLowerCase() !== "open" || status.toLowerCase() !== "closed")
    ) {
      res.status(400).json({
        message: "Invalid status!",
      });
    } else {
      const newWeeklyTraining = await WeeklyTrainingSchedule.create({
        name,
        team,
        day,
        vanue,
        from,
        to,
        status,
        created_by,
      });

      if (newWeeklyTraining) {
        res.status(200).json({
          message: "New weekly training schedule created successfully.",
        });
      } else {
        res.status(400).json({
          message:
            "Can not create new weekly training schedule. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const addCustomTrainingSchedule = async (req, res) => {
  const { name, team, date, vanue, from, to, status } = req.body;
  const created_by = req.auth.id;
  try {
    if (!name) {
      res.status(400).json({
        message: "Name is missing!",
      });
    } else if (!team) {
      res.status(400).json({
        message: "Team is missing!",
      });
    } else if (!date) {
      res.status(400).json({
        message: "Date is missing!",
      });
    } else if (!vanue) {
      res.status(400).json({
        message: "Vanue is missing!",
      });
    } else if (!from) {
      res.status(400).json({
        message: "From (start time) is missing!",
      });
    } else if (!to) {
      res.status(400).json({
        message: "To (ends time) is missing!",
      });
    } else if (!status) {
      res.status(400).json({
        message: "Status is missing!",
      });
    } else if (
      status &&
      (status.toLowerCase() !== "open" || status.toLowerCase() !== "closed")
    ) {
      res.status(400).json({
        message: "Invalid status!",
      });
    } else {
      const newCustomTraining = await CustomTrainingSchedule.create({
        name,
        team,
        date,
        vanue,
        from,
        to,
        status,
        created_by,
      });

      if (newCustomTraining) {
        res.status(200).json({
          message: "New custom training schedule created successfully.",
        });
      } else {
        res.status(400).json({
          message:
            "Can not create new custom training schedule. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allTrainingSchedule = async (req, res) => {
  try {
    const created_by = req.auth.id;
    let allTrainingSchedules = [];

    const weeklyTraning = await WeeklyTrainingSchedule.find({ created_by });
    allTrainingSchedules = [...allTrainingSchedules, ...weeklyTraning];
    const customTraining = await CustomTrainingSchedule.find({ created_by });
    allTrainingSchedules = [...allTrainingSchedules, ...customTraining];

    res.status(200).json(allTrainingSchedules);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addWeeklyTrainingSchedule,
  addCustomTrainingSchedule,
  allTrainingSchedule,
};
