const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: String,
    trainers: String,
    class_starts: String,
    class_ends: String,
    team_id: String,
    team_name: String,
    players: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const Class = new mongoose.model("Class", classSchema);

module.exports = Class;
