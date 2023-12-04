const mongoose = require("mongoose");

const chargeDetailsSchema = new mongoose.Schema(
  {
    invoice_no: String,
    date: String,
    total_amount: String,
    // details: String,
    charge_type: String,
    guardian_id: String,
    player_id: String,
    fees: String,
    billing_status: String,
    amount: String,
    created_by: String,
    identity_type: {
      type: String,
      enum: ["player registration", "ecommerce purchase"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChargeDetails = new mongoose.model("ChargeDetails", chargeDetailsSchema);

module.exports = ChargeDetails;
