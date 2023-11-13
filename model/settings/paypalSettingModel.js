const mongoose = require("mongoose");

const paypalSettingSchema = new mongoose.Schema(
  {
    account_number: String,
    private_key: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const PaypalSetting = new mongoose.model("PaypalSetting", paypalSettingSchema);

module.exports = PaypalSetting;
