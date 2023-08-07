const User = require("../../../model/user/userModel");

const getUserCountry = async (req, res) => {
  const email = req.auth.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Invalid Token!",
      });
    } else {
      const user = await User.findOne({ email });
      if (!user?.location) {
        res.status(400).json({
          message: "Invadil user credentials",
        });
      } else {
        res.status(200).json({ country: user?.location });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUserCountry,
};
