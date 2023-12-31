const mongoose = require("mongoose");

const playerSubscriptionSchema = new mongoose.Schema(
  {
    name: String,
    fee: String,
    create_date: String,
    end_date: String,
    select_team: String,
    select_team_id: String,
    description: String,
    image: Object,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const PlayerSubscription = new mongoose.model(
  "PlayerSubscription",
  playerSubscriptionSchema
);

module.exports = PlayerSubscription;
