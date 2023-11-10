const Invoice = require("../../../model/invoice/invoiceModel");

const allPendingCharges = async (req, res) => {
  try {
    const charges = await Invoice.find({ bill_status: "pending" });
    res.status(200).json(charges);
  } catch (error) {
    console.log(error);
  }
};
const allPaidCharges = async (req, res) => {
  try {
    const charges = await Invoice.find({ bill_status: "paid" });
    res.status(200).json(charges);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  allPendingCharges,
  allPaidCharges,
};
