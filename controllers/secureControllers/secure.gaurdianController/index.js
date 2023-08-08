const { generateToken } = require("../../../config/generateToken");
const User = require("../../../model/user/userModel");

const addGaurdian = async (req, res) => {
  const {
    first_name,
    last_name,
    phone,
    email,
    address_line_1,
    address_line_2,
    country,
    city,
    state,
    zip,
    password,
    confrim_password,
  } = req.body;
  const added_by = req.auth.id;
  try {
    if (!email) {
      res.status(400).josn({
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
        message: "Confrim password does not matched!",
      });
    } else if (!added_by) {
      res.status(400).json({
        message: "Athentication error!",
      });
    } else {
      const newGaurdian = await User.create({
        email,
        name: first_name && last_name ? `${first_name} ${last_name}` : "",
        phone: phone ? phone : "",
        address_line_1: address_line_1 ? address_line_1 : "",
        address_line_2: address_line_2 ? address_line_2 : "",
        country: country ? country : "",
        city: city ? city : "",
        state: state ? state : "",
        zip: zip ? zip : 0,
        password: password,
        role: "gaurdian",
        added_by,
        token: generateToken(email),
      });

      if (newGaurdian) {
        res.status(200).json({
          message: "Gaurdian created successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can not create gaurdian. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allGaurdian = async (req, res) => {
  const email = req.auth.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Authentication error",
      });
    } else {
      const gaurdians = await User.find({
        $and: [{ added_by: email }, { role: "gaurdian" }],
      }).select(["-password", "-token"]);

      res.status(200).json(gaurdians);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addGaurdian,
  allGaurdian,
};
