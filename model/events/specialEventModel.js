const mongoose = require("mongoose");

const specialEventSchema = new mongoose.Schema(
  {
    event_name: String,
    event_vanue: String,
    image: String,
    description: String,
    starts: String,
    ends: String,
    options: String,
    notification: String,
    visible_to: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const SpecialEvent = new mongoose.model("SpecialEvent", specialEventSchema);

module.exports = SpecialEvent;
