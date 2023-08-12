const mongoose = require("mongoose");

const gameScheduleSchema = new mongoose.Schema(
  {
    host_team: String,
    guest_team: String,
    vanue: String,
    game_name: String,
    date: String,
    time: String,
    image: String,
    description: String,
    staus: { type: String, enum: ["processing", "win", "lose"] },
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const GameSchedule = new mongoose.model("GameSchedule", gameScheduleSchema);

module.exports = GameSchedule;
