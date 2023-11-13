const mongoose = require("mongoose");

const stripeSettingSchema = new mongoose.Schema(
  {
    stripe_key: String,
    stripe_secret: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const StripeSetting = new mongoose.model("StripeSetting", stripeSettingSchema);

module.exports = StripeSetting;
