const User = require("../../../model/user/userModel");

const updateUserAditionalInfo = async (req, res) => {
  const email = req.auth.id;
  const data = req.body;
  try {
    if (!email) {
      res.status(400).json({
        message: "Invalid Token",
      });
    } else {
      const updateUserInfo = await User.updateOne({ email }, data);
      if (updateUserInfo) {
        res.status(200).json({
          message: "User info updated successfully.",
        });
      } else {
        res.status(400).json({ message: "Something wrong. Please try again!" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const userInfo = async (req, res) => {
  try {
    const email = req.auth.id;
    const user = await User.findOne({ email }).select(["-password"]);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  updateUserAditionalInfo,
  userInfo,
};
