const mongoose = require("mongoose");

const systemAuthority = new mongoose.Schema(
  {
    core_charge: { type: String, default: "1" },
  },
  {
    timestamps: true,
  }
);

const SystemAuthority = new mongoose.model("SystemAuthority", systemAuthority);

module.exports = SystemAuthority;
