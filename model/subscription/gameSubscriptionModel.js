const mongoose = require("mongoose");

const gameSubscriptionSchema = new mongoose.Schema(
  {
    name: String,
    fee: String,
    create_date: String,
    end_date: String,
    description: String,
    image: Object,
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
