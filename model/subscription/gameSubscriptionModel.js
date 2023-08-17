const mongoose = require("mongoose");

const gameSubscriptionSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    description: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const GameSubscription = new mongoose.model(
  "GameSubscription",
  gameSubscriptionSchema
);

module.exports = GameSubscription;
