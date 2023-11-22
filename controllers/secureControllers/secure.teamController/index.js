const isValidObjectId = require("../../../config/checkValidObjectId.js");
const Cloudinary = require("../../../config/cloudinary.js");

const Team = require("../../../model/team/teamModel");
const User = require("../../../model/user/userModel.js");

const addTeam = async (req, res) => {
  const {
    name,
    manager,
    manager_name,
    trainer,
    trainer_name,
    description,
    fee,
  } = req.body;
  const created_by = req.auth.id;
  try {
    if (!name) {
      res.status(400).json({
        message: "Name is required!",
      });
    } else if (!manager) {
      res.status(400).json({
        message: "Manager ID is required!",
      });
    } else if (!trainer) {
      res.status(400).json({
        message: "Trainer ID is required!",
      });
    } else if (!manager_name) {
      res.status(400).json({
        message: "Manager name is required!",
      });
    } else if (!trainer_name) {
      res.status(400).json({
        message: "Trainer name is required!",
      });
    } else if (!description) {
      res.status(400).json({
        message: "Description is required!",
      });
    } else if (!fee) {
      res.status(400).json({
        message: "Team fee is required!",
      });
    }
    // else if (!req.file?.path) {
    //   res.status(400).json({
    //     message: "Image is missing",
    //   });
    // }
    else {
      // ** upload the image
      // const upload = await Cloudinary.uploader.upload(req.file?.path);
      // if (upload?.secure_url) {
      //   let uploadedImage = {};
      //   uploadedImage = {
      //     uploadedImage: upload.secure_url,
      //     uploadedImage_public_url: upload.public_id,
      //   };

      //   // Enter next code there
      // } else {
      //   req.status(400).json({
      //     message: "Image upload faild! Please try again.",
      //   });
      // }

      const newTeam = await Team.create({
        name,
        manager: manager ? manager : "",
        manager_name,
        trainer: trainer ? trainer : "",
        trainer_name,
        description,
        fee,
        created_by,
        // image: uploadedImage
      });

      if (newTeam) {
        // update manager profile
        await User.findOneAndUpdate(
          {
            $and: [{ email: manager, role: "manager" }],
          },
          {
            $push: {
              team: newTeam?._id,
            },
          }
        );
        // update trainer profile
        await User.findOneAndUpdate(
          {
            $and: [{ email: trainer, role: "trainer" }],
          },
          {
            $push: {
              team: newTeam?._id,
            },
          }
        );
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

const singleTeam = async (req, res) => {
  const created_by = req.auth.id;
  const id = req?.params?.id;
  try {
    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Team ID",
      });
    } else {
      const allteams = await Team.findOne({
        $and: [{ created_by }, { _id: id }],
      });
      res.status(200).json(allteams);
    }
  } catch (error) {
    console.log(error);
  }
};

const totalTeam = async (req, res) => {
  const created_by = req.auth.id;
  try {
    const totalteams = await Team.find({ created_by });
    res.status(200).json({ totalteams: totalteams?.length });
  } catch (error) {
    console.log(error);
  }
};

const latestTeam = async (req, res) => {
  const created_by = req.auth.id;
  try {
    const teams = await Team.find({ created_by }).sort({ createdAt: 1 });
    res.status(200).json(teams);
  } catch (error) {
    console.log(error);
  }
};

const assignPlayer = async (req, res) => {
  try {
    const { player_id } = req.body;
    const id = req?.params?.id;
    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Team ID",
      });
    } else if (!isValidObjectId(player_id)) {
      res.status(400).json({
        message: "Invalid Player ID",
      });
    } else {
      const player = await User.findOne({ _id: player_id });
      if (player?._id) {
        const assign = await Team.findOneAndUpdate(
          { _id: id },
          {
            $push: {
              player: player_id,
            },
            $inc: {
              total_player: 1,
            },
          }
        );
        if (assign) {
          await User.findOneAndUpdate(
            { _id: player_id },
            {
              $push: {
                team: id,
              },
            }
          );
          res.status(200).json({
            message: "Player assigned successfully.",
          });
        } else {
          res.status(400).json({
            message: "Can't assign player. Please try again!",
          });
        }
      } else {
        res.status(400).json({
          message: "Invalid player ID. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteTeam = async (req, res) => {
  try {
    const id = req?.params?.id;
    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Team ID",
      });
    } else {
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
    }
  } catch (error) {
    console.log(error);
  }
};

const allTeamForPlayer = async (req, res) => {
  try {
    const player_id = req?.params?.id;
    const created_by = req.auth.id;
    if (!isValidObjectId(player_id)) {
      res.status(400).json({
        message: "Invalid Player ID",
      });
    } else {
      const player = await User.findOne({
        $and: [{ created_by }, { _id: player_id }],
      }).select(["-password", "-token"]);
      if (player.email) {
        let allTeams = [];
        if (player?.team?.length > 0) {
          player.team?.map(async (t) => {
            const team = await Team.findOne({ _id: t });
            if (team?._id) {
              allTeams.push(team);
            }
          });
        }
        res.status(200).json(allTeams);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addTeam,
  allTeam,
  totalTeam,
  latestTeam,
  assignPlayer,
  deleteTeam,
  singleTeam,
  allTeamForPlayer,
};
