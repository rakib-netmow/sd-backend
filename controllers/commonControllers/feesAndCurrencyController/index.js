const isValidObjectId = require("../../../config/checkValidObjectId");
const User = require("../../../model/user/userModel");

const getPlayerRegistrationFee = async (req, res) => {
  try {
    const email = req.auth.id;
    const user = await User.findOne({ email });
    if (user?._id && user?.role) {
      if (
        user?.role === "player" &&
        user?.guardian &&
        isValidObjectId(user?.guardian)
      ) {
        const guardian = await User.findOne({
          $and: [{ _id: user?.guardian }, { role: "guardian" }],
        });
        if (guardian?._id && guardian?.added_by) {
          const admin = await User.findOne({
            $and: [{ email: guardian?.added_by }, { role: "admin" }],
          });
          if (admin?._id) {
            res.status(200).json({
              player_registration_fee: admin?.player_registration_fee
                ? parseFloat(admin?.player_registration_fee)
                : 0.0,
              currency: admin?.currency ? admin?.currency : "USD",
            });
          } else {
            res.status(400).json({
              message: "Can't find Admin. Please Try again!",
            });
          }
        } else {
          res.status(400).json({
            message: "Can't find Guardian. Please Try again!",
          });
        }
      } else if (user?.role === "player" && !user?.guardian) {
        const admin = await User.findOne({ email: user?.added_by });
        if (admin?._id && admin?.role === "admin") {
          res.status(200).json({
            player_registration_fee: admin?.player_registration_fee
              ? parseFloat(admin?.player_registration_fee)
              : 0.0,
            currency: admin?.currency ? admin?.currency : "USD",
          });
        } else if (admin?._id && admin?.role === "guardian") {
          const newAdmin = await User.findOne({
            $and: [{ email: admin?.added_by }, { role: "admin" }],
          });
          if (newAdmin?._id) {
            res.status(200).json({
              player_registration_fee: newAdmin?.player_registration_fee
                ? parseFloat(newAdmin?.player_registration_fee)
                : 0.0,
              currency: newAdmin?.currency ? newAdmin?.currency : "USD",
            });
          } else {
            res.status(400).json({
              message: "Can't find Admin. Please Try again!",
            });
          }
        } else {
          res.status(400).json({
            message: "Can't find Admin. Please Try again!",
          });
        }
      } else if (
        user?.role === "manager" ||
        user?.role === "trainer" ||
        user?.role === "guardian"
      ) {
        const newAdmin = await User.findOne({
          $and: [{ email: user?.added_by }, { role: "admin" }],
        });
        if (newAdmin?._id) {
          res.status(200).json({
            player_registration_fee: newAdmin?.player_registration_fee
              ? parseFloat(newAdmin?.player_registration_fee)
              : 0.0,
            currency: newAdmin?.currency ? newAdmin?.currency : "USD",
          });
        } else {
          res.status(400).json({
            message: "Can't find Admin. Please Try again!",
          });
        }
      } else if (user?.role === "admin") {
        res.status(200).json({
          player_registration_fee: user?.player_registration_fee
            ? parseFloat(user?.player_registration_fee)
            : 0.0,
          currency: user?.currency ? user?.currency : "USD",
        });
      } else {
        res.status(400).json({
          message: "Something wrong! Can't perform oparetion.",
        });
      }
    } else {
      res.status(400).json({
        message: "Can't find user. Please try again!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getPlayerRegistrationFee,
};
