const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: String,
    code: Number,
    expireIn: Number,
  },
  {
    timestamps: true,
  }
);

otpSchema.index({ createAt: 1 }, { expireAfterSeconds: 180 });
const Otp = new mongoose.model("Otp", otpSchema);

module.exports = Otp;
