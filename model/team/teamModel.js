const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: String,
    manager: String,
    manager_name: String,
    trainer: String,
    trainer_name: String,
    player: Array,
    description: String,
    image: Object,
    fee: String,
    total_player: { type: Number, default: 0 },
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const Team = new mongoose.model("Team", teamSchema);

module.exports = Team;
