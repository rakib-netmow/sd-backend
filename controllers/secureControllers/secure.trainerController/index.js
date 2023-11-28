const isValidObjectId = require("../../../config/checkValidObjectId.js");
const Cloudinary = require("../../../config/cloudinary.js");
const { generateToken } = require("../../../config/generateToken.js");
const Team = require("../../../model/team/teamModel.js");
const User = require("../../../model/user/userModel.js");

const addTrainer = async (req, res) => {
  const {
    first_name,
    last_name,
    gender,
    date_of_birth,
    phone,
    email,
    password,
    confirm_password,
    username,
    status,
  } = req.body;

  const added_by = req.auth.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Email is required!",
      });
    } else if (!password) {
      res.status(400).json({
        message: "Password is required!",
      });
    } else if (!confirm_password) {
      res.status(400).json({
        message: "Confrim password is required!",
      });
    } else if (password !== confirm_password) {
      res.status(400).json({
        message: "Confrim password does not match!",
      });
    } else if (
      !status &&
      (status.toLowerCase() !== "active" || status.toLowerCase() !== "inactive")
    ) {
      res.status(400).json({
        message: "Invalid status!",
      });
    } else if (!req.file?.path) {
      res.status(400).json({
        message: "Image is missing",
      });
    } else {
      const existingTrainer = await User.findOne({ email });

      if (!existingTrainer) {
        // ** upload the image
        const upload = await Cloudinary.uploader.upload(req.file?.path);
        if (upload?.secure_url) {
          let uploadedImage = {};
          uploadedImage = {
            uploadedImage: upload.secure_url,
            uploadedImage_public_url: upload.public_id,
          };

          // Enter next code there
          const newTrainer = await User.create({
            email,
            password,
            name: first_name && last_name ? `${first_name} ${last_name}` : "",
            gender: gender ? gender : "",
            date_of_birth: date_of_birth ? date_of_birth : "",
            phone: phone ? phone : "",
            username: username ? username : "",
            status: status ? status.toLowerCase() : "inactive",
            role: "trainer",
            added_by,
            token: generateToken(email),
            profile_image: uploadedImage,
          });

          if (newTrainer) {
            res.status(200).json({
              message: "New trainer added successfully.",
            });
          } else {
            res.status(400).json({
              message: "Can not add new trainer. Please try again!",
            });
          }
        } else {
          req.status(400).json({
            message: "Image upload faild! Please try again.",
          });
        }
      } else {
        res.status(400).json({
          message: "Email already exist!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allTrainer = async (req, res) => {
  const added_by = req.auth.id;
  try {
    const trainers = await User.find({
      $and: [{ added_by }, { role: "trainer" }],
    });

    res.status(200).json(trainers);
  } catch (error) {
    console.log(error);
  }
};

const updateTrainer = async (req, res) => {
  const data = req.body;
  const added_by = req.auth.id;
  const id = req?.params?.id;
  try {
    if (data?.email || data?.username) {
      res.status(400).json({
        message: "You can't change your email or username!",
      });
    } else if (data?.password && data?.password !== data?.confirm_password) {
      res.status(400).json({
        message: "Confrim password is not matched!",
      });
    } else if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Trainer ID",
      });
    } else {
      const trainer = await User.findOneAndUpdate(
        {
          $and: [{ _id: id }, { added_by }],
        },
        data
      );

      if (trainer) {
        res.status(200).json({
          message: "Infromation updated successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can't update information. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteTrainer = async (req, res) => {
  try {
    const id = req?.params?.id;
    const added_by = req.auth.id;
    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Trainer ID",
      });
    } else {
      const trainer = await User.findOneAndDelete({ _id: id });
      if (trainer) {
        res.status(200).json({
          message: "Trainer deleted syccessfully.",
        });
      } else {
        res.status(400).json({
          message: "Cant not delete trainer. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const singleTrainer = async (req, res) => {
  const email = req.auth.id;
  const id = req?.params?.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Authentication error",
      });
    } else if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Trainer ID",
      });
    } else {
      const trainer = await User.findOne({
        $and: [{ _id: id }, { added_by: email }, { role: "trainer" }],
      }).select(["-password", "-token"]);

      res.status(200).json(trainer);
    }
  } catch (error) {
    console.log(error);
  }
};

const allTeamForSingleTrainer = async (req, res) => {
  const email = req.auth.id;
  const id = req?.params?.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Authentication error",
      });
    } else if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Trainer ID",
      });
    } else {
      const trainer = await User.findOne({
        $and: [{ _id: id }, { added_by: email }, { role: "trainer" }],
      });
      if (trainer?._id && trainer?.email) {
        const team = await Team.find({
          $and: [{ trainer: trainer?.email }, { created_by: email }],
        });
        if (team) {
          res.status(200).json(team);
        } else {
          res.status(400).json({
            message: "Can't find teams!",
          });
        }
      } else {
        res.status(400).json({
          message: "Can't find trainer!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getRemainingTeamListForTrainer = async (req, res) => {
  try {
    const trainerId = req.params.id;
    if (!trainerId || !isValidObjectId(trainerId)) {
      res.status(400).json({
        message: "Invalid trainer id!",
      });
    } else {
      const trainer = await User.findOne({ _id: trainerId });
      if (trainer?._id && trainer?.email) {
        const remainTeams = await Team.find({
          $and: [
            { trainer: { $nin: [trainer?.email] } },
            { created_by: trainer?.added_by },
          ],
        });
        res.status(200).json(remainTeams);
      } else {
        res.status(400).json({
          message: "Can't find trainer!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const removeTeamForTrainer = async (req, res) => {
  try {
    const teamId = req.params.id;
    const { trainer_id } = req.body;
    if (!teamId || !isValidObjectId(teamId)) {
      res.status(400).json({
        message: "Invalid Team id!",
      });
    } else if (!trainer_id || !isValidObjectId(trainer_id)) {
      res.status(400).json({
        message: "Invalid trainer id!",
      });
    } else {
      const trainer = await User.findOne({
        $and: [{ _id: trainer_id }, { role: "trainer" }],
      });
      if (trainer?._id && trainer?.email) {
        const updateTeam = await Team.findOneAndUpdate(
          { _id: teamId },
          {
            $set: {
              trainer: "",
              trainer_name: "",
            },
          }
        );
        if (updateTeam) {
          res.status(200).json({
            message: "Team Removed Successfully,",
          });
        } else {
          res.status(400).json({
            message: "Can't Remove Team. Please Try again!",
          });
        }
      } else {
        res.status(400).json({
          message: "Can't find trainer!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const assignTeamListForTrainer = async (req, res) => {
  try {
    const teamId = req.params.id;
    const { trainer_id } = req.body;
    if (!teamId || !isValidObjectId(teamId)) {
      res.status(400).json({
        message: "Invalid Team id!",
      });
    } else if (!trainer_id || !isValidObjectId(trainer_id)) {
      res.status(400).json({
        message: "Invalid trainer id!",
      });
    } else {
      const trainer = await User.findOne({
        $and: [{ _id: trainer_id }, { role: "trainer" }],
      });
      if (trainer?._id && trainer?.email) {
        // exsiting team
        const existingTeam = await Team.findOne({ _id: teamId });
        if (existingTeam?.trainer) {
          await User.findOneAndUpdate(
            { $and: [{ email: existingTeam?.trainer }, { role: "trainer" }] },
            {
              $pull: { team: existingTeam?._id },
              $pull: { team_names: existingTeam?.name },
            }
          );
        }
        const updateTeam = await Team.findOneAndUpdate(
          { _id: teamId },
          {
            $set: {
              trainer: trainer?.email,
              trainer_name: trainer?.name,
            },
          }
        );
        if (updateTeam) {
          res.status(200).json({
            message: "Team Updated Successfully,",
          });
        } else {
          res.status(400).json({
            message: "Can't Update Team. Please Try again!",
          });
        }
      } else {
        res.status(400).json({
          message: "Can't find trainer!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addTrainer,
  allTrainer,
  updateTrainer,
  deleteTrainer,
  singleTrainer,
  allTeamForSingleTrainer,
  getRemainingTeamListForTrainer,
  removeTeamForTrainer,
  assignTeamListForTrainer,
};
