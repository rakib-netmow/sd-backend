const mongoose = require("mongoose");

const cnameSettingSchema = new mongoose.Schema(
  {
    host_name: String,
    value: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const CnameSetting = new mongoose.model("CnameSetting", cnameSettingSchema);

module.exports = CnameSetting;
