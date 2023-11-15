const mongoose = require("mongoose");

const gameScheduleSchema = new mongoose.Schema(
  {
    host_team_name: String,
    host_team_id: String,
    guest_team_name: String,
    guest_team_id: String,
    // team: String,
    vanue: String,
    game_name: String,
    date: String,
    time: String,
    image: String,
    description: String,
    status: { type: String, enum: ["processing", "win", "lose"] },
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const GameSchedule = new mongoose.model("GameSchedule", gameScheduleSchema);

module.exports = GameSchedule;
