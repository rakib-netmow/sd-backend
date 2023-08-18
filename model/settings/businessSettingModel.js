const mongoose = require("mongoose");

const businessSettingSchema = new mongoose.Schema(
  {
    company_name: String,
    short_info: String,
    address1: String,
    address2: String,
    state: String,
    city: String,
    zip: Number,
    website: String,
    phone: String,
    email: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const BusinessSetting = new mongoose.model(
  "BusinessSetting",
  businessSettingSchema
);

module.exports = BusinessSetting;
