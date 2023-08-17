const mongoose = require("mongoose");

const playerSubscriptionSchema = new mongoose.Schema(
  {
    name: String,
    fee: String,
    for_: String,
    end_date: String,
    description: String,
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
