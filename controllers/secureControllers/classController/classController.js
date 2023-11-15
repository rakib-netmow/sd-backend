const Class = require("../../../model/class/classModel");

const addClass = async (req, res) => {
  const {
    name,
    trainers,
    class_starts,
    class_ends,
    team_id,
    team_name,
    players,
  } = req.body;
  const created_by = req.auth.id;
  try {
    if (!name) {
      res.status(400).json({
        message: "Class name is required!",
      });
    } else if (!trainers) {
      res.status(400).json({
        message: "Class trainer is required!",
      });
    } else if (!class_starts) {
      res.status(400).json({
        message: "Class start time is required!",
      });
    } else if (!class_ends) {
      res.status(400).json({
        message: "Class end time is required!",
      });
    } else if (!team_id) {
      res.status(400).json({
        message: "Team ID is required!",
      });
    } else if (!team_name) {
      res.status(400).json({
        message: "Team name is required!",
      });
    } else if (!players) {
      res.status(400).json({
        messgae: "Player is required!",
      });
    } else {
      const newClass = await Class.create({
        name,
        trainers,
        class_starts,
        class_ends,
        team_id,
        team_name,
        players,
        created_by,
      });

      if (newClass) {
        res.status(200).json({
          message: "New class is created successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can not create new class. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allClass = async (req, res) => {
  try {
    const created_by = req.auth.id;
    const allClasses = await Class.find({ created_by });
    res.status(200).json(allClasses);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addClass,
  allClass,
};
