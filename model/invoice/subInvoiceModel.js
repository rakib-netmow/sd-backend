const mongoose = require("mongoose");

const subInvoiceSchema = new mongoose.Schema(
  {
    // invoice_no: String,
    main_invoice_no: String,
    charges_details: Object, // {chargesDetails ID [sub charges details _id], details}
    billing_from: String,
    billing_to: String,
    last_payment_date: String,
    bill_status: String,
    amount: String,
    created_by: String,
    identity_type: {
      type: String,
      enum: ["player registration", "ecommerce purchase"],
    },
  },
  {
    timestamps: true,
  }
);

const SubInvoice = new mongoose.model("SubInvoice", subInvoiceSchema);

module.exports = SubInvoice;
