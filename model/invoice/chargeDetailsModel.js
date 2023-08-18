const mongoose = require("mongoose");

const chargeDetailsSchema = new mongoose.Schema(
  {
    invoice_no: String,
    details: String,
    charge_type: String,
    guardian_id: String,
    player_id: String,
    fees: String,
    status: String,
    amount: String,
    date: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const ChargeDetails = new mongoose.model("ChargeDetails", chargeDetailsSchema);

module.exports = ChargeDetails;
