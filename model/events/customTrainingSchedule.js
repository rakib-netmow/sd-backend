const mongoose = require("mongoose");

const customTrainingScheduleSchema = new mongoose.Schema(
  {
    name: String,
    team: String,
    date: String,
    date_type: { type: String, default: "custom" },
    vanue: String,
    from: String,
    to: String,
    staus: { type: String, enum: ["open", "closed"] },
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const CustomTrainingSchedule = new mongoose.model(
  "CustomTrainingSchedule",
  customTrainingScheduleSchema
);

module.exports = CustomTrainingSchedule;
