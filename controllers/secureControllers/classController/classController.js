const Class = require("../../../model/class/classModel");

const addClass = async (req, res) => {
  const { name, trainers, class_starts, class_ends, teams, players } = req.body;
  const created_by = req.auth.id;
  try {
    if (!name) {
      res.status(400).json({
        message: "Class name is required!",
      });
    } else if (!trainers) {
      res.status(400).json({
        message: "Class trainers are required!",
      });
    } else if (!class_starts) {
      res.status(400).json({
        message: "Class start time is required!",
      });
    } else if (!class_ends) {
      res.status(400).json({
        message: "Class end time is required!",
      });
    } else if (!teams) {
      res.status(400).json({
        message: "Teams are required!",
      });
    } else if (!players) {
      res.status(400).json({
        messgae: "Players are required!",
      });
    } else {
      const newClass = await Class.create({
        name,
        trainers,
        class_starts,
        class_ends,
        teams,
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
