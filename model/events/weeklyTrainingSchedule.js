const mongoose = require("mongoose");

const weeklyTrainingScheduleSchema = new mongoose.Schema(
  {
    name: String,
    team: String,
    day: String,
    date_type: {type: String, default: "weekly"},
    vanue: String,
    from: String,
    to: String,
    status: { type: String, enum: ["open", "closed"] },
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const WeeklyTrainingSchedule = new mongoose.model(
  "WeeklyTrainingSchedule",
  weeklyTrainingScheduleSchema
);

module.exports = WeeklyTrainingSchedule;
