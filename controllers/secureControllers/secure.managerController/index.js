const isValidObjectId = require("../../../config/checkValidObjectId.js");
const Cloudinary = require("../../../config/cloudinary.js");
const sendLoginCredentials = require("../../../config/credentialEmail.js");
const { generateToken } = require("../../../config/generateToken.js");
const Team = require("../../../model/team/teamModel.js");
const User = require("../../../model/user/userModel.js");

const addManager = async (req, res) => {
  console.log("file ", req.file?.path);
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
    }
    // else if (!req.file?.path) {
    //   res.status(400).json({
    //     message: "Image is missing",
    //   });
    // }
    else if (!confirm_password) {
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
    } else {
      const existingManger = await User.findOne({ email });
      if (!existingManger?.email) {
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

        const newManager = await User.create({
          email,
          password,
          name: first_name && last_name ? `${first_name} ${last_name}` : "",
          gender: gender ? gender : "",
          date_of_birth: date_of_birth ? date_of_birth : "",
          phone: phone ? phone : "",
          username: username ? username : "",
          status: status ? status.toLowerCase() : "inactive",
          role: "manager",
          added_by,
          token: generateToken(email),
          // profile_image: uploadedImage
        });

        if (newManager) {
          sendLoginCredentials(email, password);
          res.status(200).json({
            message: "New manager added successfully.",
          });
        } else {
          res.status(400).json({
            message: "Can not add new manager. Please try again!",
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

const allManager = async (req, res) => {
  const added_by = req.auth.id;
  try {
    const managers = await User.find({
      $and: [{ added_by }, { role: "manager" }],
    });

    res.status(200).json(managers);
  } catch (error) {
    console.log(error);
  }
};

const updateManager = async (req, res) => {
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
        message: "Invalid Manager ID",
      });
    } else {
      const manager = await User.findOneAndUpdate(
        {
          $and: [{ _id: id }, { added_by }],
        },
        data
      );

      if (manager) {
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

const deleteManager = async (req, res) => {
  try {
    const id = req?.params?.id;
    const added_by = req.auth.id;

    const manager = await User.findOneAndDelete({ _id: id });
    if (manager) {
      res.status(200).json({
        message: "Manager deleted syccessfully.",
      });
    } else if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Manager ID",
      });
    } else {
      res.status(400).json({
        message: "Cant not delete manager. Please try again!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const singleManager = async (req, res) => {
  const email = req.auth.id;
  const id = req?.params?.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Authentication error",
      });
    } else if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Manager ID",
      });
    } else {
      const manager = await User.findOne({
        $and: [{ _id: id }, { added_by: email }, { role: "manager" }],
      }).select(["-password", "-token"]);

      res.status(200).json(manager);
    }
  } catch (error) {
    console.log(error);
  }
};

const allTeamForSingleManager = async (req, res) => {
  const email = req.auth.id;
  const id = req?.params?.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Authentication error",
      });
    } else if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Manager ID",
      });
    } else {
      const manager = await User.findOne({
        $and: [{ _id: id }, { added_by: email }, { role: "manager" }],
      });
      if (manager?._id && manager?.email) {
        const team = await Team.find({
          $and: [{ manager: manager?.email }, { created_by: email }],
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
          message: "Can't find manager!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getRemainingTeamListForManager = async (req, res) => {
  try {
    const managerId = req.params.id;
    if (!managerId || !isValidObjectId(managerId)) {
      res.status(400).json({
        message: "Invalid manager id!",
      });
    } else {
      const manager = await User.findOne({ _id: managerId });
      if (manager?._id && manager?.email) {
        const remainTeams = await Team.find({
          $and: [
            { manager: { $nin: [manager?.email] } },
            { created_by: manager?.added_by },
          ],
        });
        res.status(200).json(remainTeams);
      } else {
        res.status(400).json({
          message: "Can't find manager!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const assignTeamListForManager = async (req, res) => {
  try {
    const teamId = req.params.id;
    const { manager_id } = req.body;
    if (!teamId || !isValidObjectId(teamId)) {
      res.status(400).json({
        message: "Invalid Team id!",
      });
    } else if (!manager_id || !isValidObjectId(manager_id)) {
      res.status(400).json({
        message: "Invalid manager id!",
      });
    } else {
      const manager = await User.findOne({
        $and: [{ _id: manager_id }, { role: "manager" }],
      });
      if (manager?._id && manager?.email) {
        const updateTeam = await Team.findOneAndUpdate(
          { _id: teamId },
          {
            $set: {
              manager: manager?.email,
              manager_name: manager?.name,
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
          message: "Can't find manager!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const removeTeamForManager = async (req, res) => {
  try {
    const teamId = req.params.id;
    const { manager_id } = req.body;
    if (!teamId || !isValidObjectId(teamId)) {
      res.status(400).json({
        message: "Invalid Team id!",
      });
    } else if (!manager_id || !isValidObjectId(manager_id)) {
      res.status(400).json({
        message: "Invalid manager id!",
      });
    } else {
      const manager = await User.findOne({
        $and: [{ _id: manager_id }, { role: "manager" }],
      });
      if (manager?._id && manager?.email) {
        const updateTeam = await Team.findOneAndUpdate(
          { _id: teamId },
          {
            $set: {
              manager: "",
              manager_name: "",
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
          message: "Can't find manager!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addManager,
  allManager,
  updateManager,
  deleteManager,
  singleManager,
  allTeamForSingleManager,
  getRemainingTeamListForManager,
  assignTeamListForManager,
  removeTeamForManager,
};
