const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: String,
    manager: String,
    trainer: String,
    description: String,
    image: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const Team = new mongoose.model("Team", teamSchema);

module.exports = Team;
