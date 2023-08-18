const mongoose = require("mongoose");

const currencySettingSchema = new mongoose.Schema(
  {
    gst: String,
    currency: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const CurrencySetting = new mongoose.model(
  "CurrencySetting",
  currencySettingSchema
);

module.exports = CurrencySetting;
