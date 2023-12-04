const mongoose = require("mongoose");

const subChargeDetailsSchema = new mongoose.Schema(
  {
    main_invoice_no: String, // this will be sub invoice _id
    sub_invoice_no: String, // this will be sub invoice _id
    main_charges_details: String, // this will be main charges details _id
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

const SubChargeDetails = new mongoose.model(
  "SubChargeDetails",
  subChargeDetailsSchema
);

module.exports = SubChargeDetails;
