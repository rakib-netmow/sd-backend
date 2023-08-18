const emailVerifiaction = require("../../../config/emailVerification");
const sendOtpMail = require("../../../config/sendOtpMail");
const Otp = require("../../../model/user/otpModel");

const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      res.status(400).json({
        message: "Email is required!",
      });
    } else {
      const newCode = Math.floor(1000 + Math.random() * 9000);
      const newExpireTime = new Date().getTime() + 300 * 1000;

      await Otp.findOneAndDelete({ email });

      const newOtp = await Otp.create({
        email,
        code: newCode,
        expireIn: newExpireTime,
      });

      if (newOtp) {
        // have to send otp to the email
        // here
        sendOtpMail(email, newOtp.code);
        // emailVerifiaction(email, newOtp.code);
        res.status(200).json({
          message: "Otp send Successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const checkOtp = async (req, res) => {
  const { otp, email } = req.body;
  try {
    if (!email) {
      res.status(400).json({
        message: "Email is missing!",
      });
    } else if (!otp) {
      res.status(400).json({
        message: "OTP is missing!",
      });
    } else {
      const checkOTP = Otp.findOne({
        $and: [{ email }, { code: otp }],
      });

      if (checkOTP?.code) {
        res.status(200).json({
          message: "OTP is matched.",
        });
      } else {
        res.status(400).json({
          message: "OTP does not matched!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendOtp, checkOtp };
