const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    fees_amount: { type: String, required: true },
    charge_type: String,
    guardian_id: String,
    fees: String,
    status: String,
    created_by: { type: String, required: true },
    date: { type: String, default: new Date() },
  },
  {
    timestamps: true,
  }
);

const Fees = new mongoose.model("Fees", feesSchema);

module.exports = Fees;
