const mongoose = require("mongoose");

const seasonalGameSchema = new mongoose.Schema(
  {
    name: String,
    date: String,
    location: String,
    fees: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const SeasonalGame = new mongoose.model("SeasonalGame", seasonalGameSchema);

module.exports = SeasonalGame;
