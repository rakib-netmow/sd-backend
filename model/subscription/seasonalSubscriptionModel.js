const mongoose = require("mongoose");

const seasonalSubscriptionSchema = new mongoose.Schema(
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

const SeasonalSubscription = new mongoose.model(
  "SeasonalSubscription",
  seasonalSubscriptionSchema
);

module.exports = SeasonalSubscription;
