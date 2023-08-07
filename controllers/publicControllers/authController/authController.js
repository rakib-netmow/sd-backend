const { generateToken } = require("../../../config/generateToken");
const Otp = require("../../../model/user/otpModel");
const User = require("../../../model/user/userModel");

const register = async (req, res) => {
  const {
    sports_category,
    theme,
    organisation_name,
    subdomain,
    email,
    phone,
    country,
    password,
    confrim_password,
    otp,
  } = req.body;
  try {
    if (!subdomain) {
      res.status(400).json({
        message: "Subdomain is required!",
      });
    }
    if (!email) {
      res.status(400).json({
        message: "Email is required!",
      });
    }
    if (!phone) {
      res.status(400).json({
        message: "Phone is required!",
      });
    }
    if (!country) {
      res.status(400).json({
        message: "Location is required!",
      });
    }
    if (!password) {
      res.status(400).json({
        message: "Password is required!",
      });
    }
    if (!otp) {
      res.status(400).json({
        message: "OTP is required!",
      });
    }

    const getOtp = await Otp.findOne({ email });

    if (getOtp?.code && otp !== getOtp?.code) {
      res.status(400).json({
        message: "Invalid OTP!",
      });
    } else {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.status(400).json({
          message: "This email is already taken!",
        });
      } else {
        const user = await User.create({
          sports_category,
          theme,
          organisation_name,
          subdomain,
          email,
          phone,
          country,
          password,
          token: generateToken(email),
        });

        if (user) {
          await Otp.deleteOne({ email });

          res.status(200).json(user);
        } else {
          res.status(400).json({
            message: "Something wrong. Please try again!",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      res.status(400).json({
        message: "Email is required!",
      });
    }
    if (!password) {
      res.status(400).json({
        message: "Password is required!",
      });
    }

    const userData = await User.findOne({ email: email });
    if (!userData) {
      res.status(400).json({
        message: "Can not find any user!",
      });
    } else {
      await User.findOneAndUpdate(
        { email: userData?.email },
        {
          $set: {
            token: generateToken(userData?.email),
          },
        }
      );

      const updatedUser = await User.findOne({ email: userData?.email });

      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(400).json({
          message: "Login faild.",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
};
