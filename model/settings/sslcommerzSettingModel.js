const mongoose = require("mongoose");

const sslcommerzSettingSchema = new mongoose.Schema(
  {
    account_number: String,
    private_key: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const SslcommerzSetting = new mongoose.model(
  "SslcommerzSetting",
  sslcommerzSettingSchema
);

module.exports = SslcommerzSetting;
