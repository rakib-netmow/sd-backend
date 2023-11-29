const { generateToken } = require("../../../config/generateToken");
const BusinessSetting = require("../../../model/settings/businessSettingModel");
const Otp = require("../../../model/user/otpModel");
const Subdomain = require("../../../model/user/subdomainModel");
const User = require("../../../model/user/userModel");
const getCurrencyAbbreviation =
  require("country-currency-map").getCurrencyAbbreviation;

const register = async (req, res) => {
  const {
    sports_category,
    theme,
    organisation_name,
    subdomain,
    email,
    phone,
    country,
    player_registration_fee,
    gst,
    password,
    confirm_password,
  } = req.body;
  try {
    if (!subdomain) {
      res.status(400).json({
        message: "Subdomain is required!",
      });
    } else if (!email) {
      res.status(400).json({
        message: "Email is required!",
      });
    } else if (!phone) {
      res.status(400).json({
        message: "Phone is required!",
      });
    } else if (!country) {
      res.status(400).json({
        message: "Location is required!",
      });
    } else if (!player_registration_fee) {
      res.status(400).json({
        message: "Player registration fee is required!",
      });
    } else if (!gst) {
      res.status(400).json({
        message: "GST is required!",
      });
    } else if (!password) {
      res.status(400).json({
        message: "Password is required!",
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
          // theme,
          organisation_name,
          subdomain,
          email,
          phone,
          country,
          player_registration_fee,
          gst,
          currency: getCurrencyAbbreviation(country),
          password,
          token: generateToken(email),
        });

        if (user) {
          await Otp.deleteOne({ email });

          await Subdomain.create({
            name: subdomain,
            woner: email,
          });

          // await BusinessSetting.create({
          //   company_name: organisation_name,
          //   created_by: email,
          // });

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
  // console.log(req.hostname);
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
    } else {
      const userData = await User.findOne({ email: email });
      if (userData && userData && (await userData.matchPassword(password))) {
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
      } else {
        res.status(400).json({
          message: "Can not find any user!",
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
