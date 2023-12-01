const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema(
  {
    payment_by: String,
    payment_for_title: String,
    payment_for_id: String,
    amount: { type: String, required: true },
    // transaction_id: { type: String, required: true },
    payment_method: { type: String, required: true },
    status: { type: String, required: true, enum: ["paid", "unpaid"] },
    date: { type: String, default: new Date() },
    admin_email: String,
  },
  {
    timestamps: true,
  }
);

const Transaction = new mongoose.model("Transaction", transactionsSchema);

module.exports = Transaction;
