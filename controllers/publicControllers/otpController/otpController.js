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
        const sendMail = sendOtpMail(email, newOtp.code);

        if (sendMail) {
          res.status(200).json({
            message: "Otp Created Successfully",
          });
        } else {
          res.status(400).json({
            message: "Can't send OTP. Please Try Again!",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendOtp;
