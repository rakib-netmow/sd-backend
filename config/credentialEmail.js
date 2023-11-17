const nodemailer = require("nodemailer");

const sendLoginCredentials = (email, password) => {
  let transpoter = nodemailer.createTransport({
    service: "Gmail",
    port: 587,
    secure: false,
    auth: {
      user: "rakib.netmow@gmail.com",
      pass: "youbuagttebjsukh",
    },
  });
  let mailOption = {
    from: "Squaddeck",
    to: email,
    subject: "Account credentials of Squaddeck.",
    html: `<div>
        <p>Here Is Your Login Credentials: </p>
        <p>Email: <strong>${email}</strong></p>
        <p>Password: <strong>${password}</strong></p>
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

module.exports = sendLoginCredentials;
