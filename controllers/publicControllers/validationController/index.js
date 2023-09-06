const User = require("../../../model/user/userModel");

const checkSubdomain = async (req, res) => {
  const { subdomain } = req.body;
  try {
    if (!subdomain) {
      res.status(400).json({
        message: "Subdomain is missing!",
      });
    } else {
      const findSubdomain = await User.findOne({ subdomain });
      if (!findSubdomain) {
        res.status(200).json({
          message: "Domain is available!",
        });
      } else {
        res.status(400).json({
          message: "Domain is unavailable!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  checkSubdomain,
};
