const Invoice = require("../../../model/invoice/invoiceModel");

const allPendingCharges = async (req, res) => {
  try {
    const charges = await Invoice.find({
      $and: [{ bill_status: "unpaid" }, { created_by: req?.auth?.id }],
    });
    res.status(200).json(charges);
  } catch (error) {
    console.log(error);
  }
};
const allPaidCharges = async (req, res) => {
  try {
    const charges = await Invoice.find({
      $and: [{ bill_status: "paid" }, { created_by: req?.auth?.id }],
    });
    res.status(200).json(charges);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  allPendingCharges,
  allPaidCharges,
};
