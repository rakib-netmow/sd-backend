const mongoose = require("mongoose");

const subdomainSchema = new mongoose.Schema(
  {
    name: String,
    woner: String,
  },
  {
    timestamps: true,
  }
);

const Subdomain = new mongoose.model("Subdomain", subdomainSchema);

module.exports = Subdomain;
