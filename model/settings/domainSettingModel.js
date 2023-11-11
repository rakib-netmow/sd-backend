const mongoose = require("mongoose");

const domainSettingSchema = new mongoose.Schema(
  {
    domain_name: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const DomainSetting = new mongoose.model("DomainSetting", domainSettingSchema);

module.exports = DomainSetting;
