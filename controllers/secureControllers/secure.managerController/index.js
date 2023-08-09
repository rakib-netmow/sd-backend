const Cloudinary = require("../../../config/cloudinary.js");
const { generateToken } = require("../../../config/generateToken.js");

const addManager = async (req, res) => {
  const {
    first_name,
    last_name,
    gender,
    date_of_birth,
    phone,
    email,
    password,
    confrim_password,
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
    } else if (!confrim_password) {
      res.status(400).json({
        message: "Confrim password is required!",
      });
    } else if (password !== confrim_password) {
      res.status(400).json({
        message: "Confrim password does not match!",
      });
    } else if (
      status &&
      (status.toLowerCase() !== "active" || status.toLowerCase() !== "inactive")
    ) {
      res.status(400).json({
        message: "Invalid status!",
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

      const newManager = await User.create({
        email,
        password,
        name: first_name && last_name ? `${first_name} ${last_name}` : "",
        gender: gender ? gender : "",
        date_of_birth: date_of_birth ? date_of_birth : "",
        phone: phone ? phone : "",
        username: username ? username : "",
        status: status ? status : "",
        role: "manager",
        added_by,
        token: generateToken(email),
      });

      if (newManager) {
        res.status(200).json({
          message: "New manager added successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can not add new manager. Please try again!",
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

module.exports = {
  addManager,
  allManager,
};
