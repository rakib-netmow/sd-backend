const mongoose = require("mongoose");

const dnsSettingSchema = new mongoose.Schema(
  {
    host_name: String,
    value: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const DnsSetting = new mongoose.model("DnsSetting", dnsSettingSchema);

module.exports = DnsSetting;
