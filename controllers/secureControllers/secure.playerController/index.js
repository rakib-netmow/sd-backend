const { generateToken } = require("../../../config/generateToken");
const User = require("../../../model/user/userModel");

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
    confrim_password,
    team,
    fees,
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
    } else if (!confrim_password) {
      res.status(400).json({
        message: "Confrim password is required!",
      });
    } else if (password !== confrim_password) {
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
    } else {
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
        added_by,
        role: "player",
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

const updatePlayer = async (req, res) => {
  const data = req.body;
  const added_by = req.auth.id;
  const id = req.params.id;
  try {
    if (data?.email || data?.username) {
      res.status(400).json({
        message: "You can't change your email or username!",
      });
    } else if (data?.password && data?.password !== data?.confrim_password) {
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
  updatePlayer,
  deletePlayer,
};
