const mongoose = require("mongoose");

const seasonalSubscriptionSchema = new mongoose.Schema(
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

const SeasonalSubscription = new mongoose.model(
  "SeasonalSubscription",
  seasonalSubscriptionSchema
);

module.exports = SeasonalSubscription;
