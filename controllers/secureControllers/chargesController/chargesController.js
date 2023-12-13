const sendPlayerRegistrationInvoiceEmail = require("../../../config/sendPlayerRegistrationInvoiceEmail");
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

const sendInvoice = async (req, res) => {
  try {
    const mainData = req.body;
    const {
      name,
      email,
      city,
      address,
      zip,
      country,
      phone,
      invoiceId,
      date,
      totalFees,
      currency,
      data,
      SubTotal,
      status,
      gst,
    } = mainData;
    if (!name) {
      res.status(400).json({
        message: "Name is missing!",
      });
    } else if (!email) {
      res.status(400).json({
        message: "Email is missing!",
      });
    } else if (!city) {
      res.status(400).json({
        message: "City is missing!",
      });
    } else if (!address) {
      res.status(400).json({
        message: "Address is missing!",
      });
    } else if (!zip) {
      res.status(400).json({
        message: "Zip code is missing!",
      });
    } else if (!country) {
      res.status(400).json({
        message: "Country is missing!",
      });
    } else if (!phone) {
      res.status(400).json({
        message: "Phone is missing!",
      });
    } else if (!invoiceId) {
      res.status(400).json({
        message: "Invoice ID is missing!",
      });
    } else if (!date) {
      res.status(400).json({
        message: "Date is missing!",
      });
    } else if (!totalFees) {
      res.status(400).json({
        message: "Total Fees is missing!",
      });
    } else if (!currency) {
      res.status(400).json({
        message: "Currency is missing!",
      });
    } else if (typeof data !== "object" || data?.length <= 0) {
      res.status(400).json({
        message: "Invalid Data!",
      });
    } else if (!SubTotal) {
      res.status(400).json({
        message: "Sub Total is missing!",
      });
    } else if (!status) {
      res.status(400).json({
        message: "Status is missing!",
      });
    } else if (!gst) {
      res.status(400).json({
        message: "GST is missing!",
      });
    } else {
      const emailRes = await sendPlayerRegistrationInvoiceEmail(
        email,
        mainData
      );
      console.log(emailRes);
      res.status(200).json(emailRes);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  allPendingCharges,
  allPaidCharges,
  sendInvoice,
};
