const { generateToken } = require("../../../config/generateToken");
const User = require("../../../model/user/userModel");
const Cloudinary = require("../../../config/cloudinary.js");

const addPlayer = async (req, res) => {
  const {
    first_name,
    last_name,
    gender,
    date_of_birth,
    height,
    weight,
    address_line_1,
    address_line_2,
    country,
    state,
    city,
    zip,
    email,
    phone,
    password,
    confirm_password,
    team,
    fees,
    description,
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
    } else if (!team) {
      res.status(400).json({
        message: "Team is required!",
      });
    } else if (!fees) {
      res.status(400).json({
        message: "Fees is required!",
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

      const existingPlayer = await User.findOne({ email });
      if (!existingPlayer) {
        const newPlayer = await User.create({
          email: email,
          password: password,
          team,
          token: generateToken(email),
          fees,
          name: first_name && last_name ? `${first_name} ${last_name}` : "",
          gender: gender ? gender : "",
          date_of_birth: date_of_birth ? date_of_birth : "",
          address_line_1: address_line_1 ? address_line_1 : "",
          address_line_2: address_line_2 ? address_line_2 : "",
          country: country ? country : "",
          city: city ? city : "",
          state: state ? state : "",
          zip: zip ? zip : 0,
          phone: phone ? phone : "",
          height: height ? height : "",
          weight: weight ? weight : "",
          description: description ? description : "",
          added_by,
          role: "player",
          // profile_image: uploadedImage
        });
        if (newPlayer) {
          res.status(200).json({
            message: "Player added successfully.",
          });
        } else {
          res.status(400).json({
            message: "Can not add Player. Please try again!",
          });
        }
      } else {
        res.status(400).json({
          message: "Already have an user with this email",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allPlayer = async (req, res) => {
  const email = req.auth.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Authentication error",
      });
    } else {
      const players = await User.find({
        $and: [{ added_by: email }, { role: "player" }],
      }).select(["-password", "-token"]);

      res.status(200).json(players);
    }
  } catch (error) {
    console.log(error);
  }
};

const totalPlayer = async (req, res) => {
  const email = req.auth.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Authentication error",
      });
    } else {
      const players = await User.find({
        $and: [{ added_by: email }, { role: "player" }],
      }).select(["-password", "-token"]);

      res.status(200).json({ totalPlayers: players.length });
    }
  } catch (error) {
    console.log(error);
  }
};

const latestPlayer = async (req, res) => {
  const email = req.auth.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Authentication error",
      });
    } else {
      const players = await User.find({
        $and: [{ added_by: email }, { role: "player" }],
      })
        .select(["-password", "-token"])
        .sort({ createdAt: 1 });

      res.status(200).json(players);
    }
  } catch (error) {
    console.log(error);
  }
};

const updatePlayer = async (req, res) => {
  const data = req.body;
  const added_by = req.auth.id;
  const id = req.params.id;
  try {
    if (data?.email || data?.username) {
      res.status(400).json({
        message: "You can't change your email or username!",
      });
    } else if (data?.password && data?.password !== data?.confirm_password) {
      res.status(400).json({
        message: "Confrim password is not matched!",
      });
    } else {
      const player = await User.findOneAndUpdate(
        {
          $and: [{ _id: id }, { added_by }],
        },
        data
      );

      if (player) {
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

const deletePlayer = async (req, res) => {
  try {
    const id = req.params.id;
    const added_by = req.auth.id;

    const player = await User.findOneAndDelete({ _id: id });
    if (player) {
      res.status(200).json({
        message: "Guardian deleted succefully.",
      });
    } else {
      res.status(400).json({
        message: "Cant not delete guardian. Please try again!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addPlayer,
  allPlayer,
  totalPlayer,
  latestPlayer,
  updatePlayer,
  deletePlayer,
};
