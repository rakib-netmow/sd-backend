const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoice_no: String,
    charges_details: Array,
    billing_form: String,
    billing_to: String,
    last_payment_date: String,
    bill_status: String,
    amount: String,
    created_by: String,
  },
  {
    timestamps: true,
  }
);

const Invoice = new mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
