const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    admin_id: String,
    admin_email: String,
    total_charges: String,
    last_payment_date: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const Wallet = new mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
