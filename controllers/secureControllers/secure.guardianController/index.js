const { generateToken } = require("../../../config/generateToken");
const User = require("../../../model/user/userModel");

const addGuardian = async (req, res) => {
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
    confirm_password,
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
        message: "Confirm password is required!",
      });
    } else if (password !== confirm_password) {
      res.status(400).json({
        message: "Confrim password does not matched!",
      });
    } else if (!added_by) {
      res.status(400).json({
        message: "Athentication error!",
      });
    } else {
      const existingGuardian = await User.findOne({ email });
      if (!existingGuardian) {
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
          role: "guardian",
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

const allGuardian = async (req, res) => {
  const email = req.auth.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Authentication error",
      });
    } else {
      const gaurdians = await User.find({
        $and: [{ added_by: email }, { role: "guardian" }],
      }).select(["-password", "-token"]);

      res.status(200).json(gaurdians);
    }
  } catch (error) {
    console.log(error);
  }
};
const totalGuardian = async (req, res) => {
  const email = req.auth.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Authentication error",
      });
    } else {
      const gaurdians = await User.find({
        $and: [{ added_by: email }, { role: "guardian" }],
      }).select(["-password", "-token"]);

      res.status(200).json({ totalGuardians: gaurdians.length });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateGuardian = async (req, res) => {
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
      const guardian = await User.findOneAndUpdate(
        {
          $and: [{ _id: id }, { added_by }],
        },
        data
      );

      if (guardian) {
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

const deleteGuardian = async (req, res) => {
  try {
    const id = req.params.id;
    const added_by = req.auth.id;

    const guardian = await User.findOneAndDelete({ _id: id });
    if (guardian) {
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
  addGuardian,
  allGuardian,
  totalGuardian,
  updateGuardian,
  deleteGuardian,
};
