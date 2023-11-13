const SmtpSetting = require("../../../model/settings/smtpSettingModel");

const addSmtp = async (req, res) => {
  try {
    const { smtp_host, smtp_port, email, sent_from, username, password } =
      req.body;
    const created_by = req.auth.id;
    const existingSmtp = await SmtpSetting.findOne({ created_by });
    if (existingSmtp?.username) {
      const updateSmtp = await SmtpSetting.findOneAndUpdate(
        {
          $and: [{ created_by }, { username: existingPaypal?.username }],
        },
        req?.body
      );
      if (updateSmtp) {
        res.status(200).json({
          message: "Saved changes.",
        });
      } else {
        res.status(400).json({
          message: "Can't save changed!",
        });
      }
    } else {
      if (!smtp_host) {
        res.status(400).json({
          message: "SMTP host is missing!",
        });
      } else if (!smtp_port) {
        res.status(400).json({
          message: "SMTP port is missing!",
        });
      } else if (!email) {
        res.status(400).json({
          message: "Email is missing!",
        });
      } else if (!sent_from) {
        res.status(400).json({
          message: "Sent from is missing!",
        });
      } else if (!username) {
        res.status(400).json({
          message: "Username is missing!",
        });
      } else if (!password) {
        res.status(400).json({
          message: "Password is missing!",
        });
      } else {
        const newSmtp = await SmtpSetting.create({
          smtp_host,
          smtp_port,
          email,
          sent_from,
          username,
          password,
          created_by,
        });
        if (newSmtp) {
          res.status(200).json({
            message: "Saved changes.",
          });
        } else {
          res.status(400).json({
            message: "Can't save changed!",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addSmtp,
};
