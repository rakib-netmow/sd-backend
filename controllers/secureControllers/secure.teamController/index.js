// const Cloudinary = require("../../../config/cloudinary.js");

const Team = require("../../../model/team/teamModel");

const addTeam = async (req, res) => {
  const { name, manager, trainer, description } = req.body;
  const created_by = req.auth.id;
  try {
    if (!name) {
      res.status(400).json({
        message: "Name is required!",
      });
    } else if (!manager) {
      res.status(400).json({
        message: "Manager is required!",
      });
    } else if (!trainer) {
      res.status(400).json({
        message: "Trainer is required!",
      });
    } else if (!description) {
      res.status(400).json({
        message: "Description is required!",
      });
    } else {
      //** upload the image
      // let avatar = {};
      // if (req.file?.path) {
      //   const image = await Cloudinary.uploader.upload(req.file?.path);
      //   avatar = {
      //     avatar: image.secure_url,
      //     avatar_public_url: image.public_id,
      //   };
      // }

      const newTeam = await Team.create({
        name,
        manager,
        trainer,
        description,
        created_by,
      });

      if (newTeam) {
        res.status(200).json({
          message: "New team created successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can not create new team. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allTeam = async (req, res) => {
  const created_by = req.auth.id;
  try {
    const allteams = await Team.find({ created_by });
    res.status(200).json(allteams);
  } catch (error) {
    console.log(error);
  }
};

const assignPlayer = async (req, res) => {
  try {
    const { player_id } = req.body;
    const id = req.params.id;
    const assign = await Team.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          player: player_id,
        },
      }
    );
    if (assign) {
      res.status(200).json({
        message: "Player assigned successfully.",
      });
    } else {
      res.status(400).json({
        message: "Can't assign player. Please try again!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteTeam = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedTeam = await Team.findOneAndDelete({ _id: id });

    if (deletedTeam) {
      res.status(200).json({
        message: "Team deleted successfully.",
      });
    } else {
      res.status(400).json({
        message: "Can't delete team. Please try again!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addTeam,
  allTeam,
  assignPlayer,
  deleteTeam,
};
