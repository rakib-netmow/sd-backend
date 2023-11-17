const mongoose = require("mongoose");

const sponsorSchema = new mongoose.Schema(
  {
    name: String,
    website: String,
    logo: Object,
    sponsoring: String,
    start_date: String,
    end_date: String,
    description: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const Sponsor = new mongoose.model("Sponsor", sponsorSchema);

module.exports = Sponsor;
