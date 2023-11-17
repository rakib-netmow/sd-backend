const mongoose = require("mongoose");

const specialEventSchema = new mongoose.Schema(
  {
    event_name: String,
    event_vanue: String,
    image: Object,
    description: String,
    starts: String,
    ends: String,
    options: String,
    notification: String,
    visible_to: Array,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const SpecialEvent = new mongoose.model("SpecialEvent", specialEventSchema);

module.exports = SpecialEvent;
