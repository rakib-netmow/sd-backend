const mongoose = require("mongoose");

const smtpSettingSchema = new mongoose.Schema(
  {
    smtp_host: String,
    ismtp_port: Number,
    email: String,
    sent_from: String,
    username: String,
    password: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const SmtpSetting = new mongoose.model("SmtpSetting", smtpSettingSchema);

module.exports = SmtpSetting;
