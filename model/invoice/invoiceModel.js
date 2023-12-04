const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    // invoice_no: String,
    charges_details: Array, // {chargesDetails ID, sub invoice ID, details,}
    billing_from: String,
    billing_to: String,
    last_payment_date: String,
    bill_status: String,
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

const Invoice = new mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
