const nodemailer = require("nodemailer");

const sendOtpMail = (email, otp) => {
  let transpoter = nodemailer.createTransport({
    service: "Gmail",
    port: 587,
    secure: false,
    auth: {
      user: "rakib.netmow@gmail.com",
      pass: "youbuagttebjsukh",
    },
  });
  console.log(otp);
  let mailOption = {
    from: "Squaddeck",
    to: email,
    subject: "Please Verify Your Email.",
    html: `<div>
        <p>Here Is Your Email Verification Code: ${otp}</p>
        <br />
    </div>`,
  };

  transpoter.sendMail(mailOption, async (error, info) => {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};

module.exports = sendOtpMail;
