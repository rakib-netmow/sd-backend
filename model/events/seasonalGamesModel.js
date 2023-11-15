const mongoose = require("mongoose");

const seasonalGameSchema = new mongoose.Schema(
  {
    name: String,
    host_team_name: String,
    host_team_id: String,
    guest_team_name: String,
    guest_team_id: String,
    vanue: String,
    image: String,
    description: String,
    starts: String,
    ends: String,
    notification: {
      type: String,
      enum: ["push notification and email", "none"],
    },
    // location: String,
    fees: String,
    visible_to: Array,
    status: {
      type: String,
      enum: ["pendin", "running", "end"],
      default: "pending",
    },
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const SeasonalGame = new mongoose.model("SeasonalGame", seasonalGameSchema);

module.exports = SeasonalGame;
