const mongoose = require("mongoose");

const nsSettingSchema = new mongoose.Schema(
  {
    host_name: String,
    value: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const NsSetting = new mongoose.model("NsSetting", nsSettingSchema);

module.exports = NsSetting;
