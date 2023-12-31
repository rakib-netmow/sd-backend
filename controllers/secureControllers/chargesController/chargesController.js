const { ObjectId } = require("mongodb");
const isValidObjectId = require("../../../config/checkValidObjectId");
const sendPlayerRegistrationInvoiceEmail = require("../../../config/sendPlayerRegistrationInvoiceEmail");
const ChargeDetails = require("../../../model/invoice/chargeDetailsModel");
const Invoice = require("../../../model/invoice/invoiceModel");
const SubChargeDetails = require("../../../model/invoice/subChargeDetails");

const allPendingCharges = async (req, res) => {
  try {
    const charges = await Invoice.find({
      $and: [
        { bill_status: "unpaid" },
        { created_by: req?.auth?.id },
        { charges_details: { $exists: true, $ne: [] } },
      ],
    });
    res.status(200).json(charges);
  } catch (error) {
    console.log(error);
  }
};
const allPaidCharges = async (req, res) => {
  try {
    const charges = await ChargeDetails.find({
      $and: [{ billing_status: "paid" }, { created_by: req?.auth?.id }],
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

const getMultipleChargesDetails = async (req, res) => {
  try {
    const mainInvoiceID = req.params.id;
    if (!mainInvoiceID || !isValidObjectId(mainInvoiceID)) {
      res.status(400).json({
        message: "Invalid invoice id!",
      });
    } else {
      const invoice = await Invoice.findOne({ _id: ObjectId(mainInvoiceID) });
      if (invoice?._id && invoice?.charges_details?.length > 0) {
        const chargesDetailsIdDoc = invoice?.charges_details?.map((c) => {
          return c?.chargesDetailsId;
        });
        if (chargesDetailsIdDoc?.length > 0) {
          const allChargesDetails = await ChargeDetails.find({
            _id: { $in: chargesDetailsIdDoc },
          });
          if (allChargesDetails) {
            res.status(200).json(allChargesDetails);
          } else {
            res.status(400).json({
              message: "Can't find charges details!",
            });
          }
        } else {
          res.status(400).json({
            message: "Can't find charges details id!",
          });
        }
      } else {
        res.status(400).json({
          message: "Can't find Invoice!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getSingleChargesDetails = async (req, res) => {
  try {
    const subInvoiceID = req.params.id;
    if (!subInvoiceID || !isValidObjectId(subInvoiceID)) {
      res.status(400).json({
        message: "Invalid invoice id!",
      });
    } else {
      const allChargesDetails = await SubChargeDetails.find({
        sub_invoice_no: subInvoiceID,
      });
      if (allChargesDetails) {
        res.status(200).json(allChargesDetails);
      } else {
        res.status(400).json({
          message: "Can't find charges details!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allPaidChargesdetails = async (req, res) => {
  try {
    const invoice_no = req.params.id;
    if (!invoice_no) {
      res.status(400).json({
        message: "Invoice ID is missing!",
      });
    } else {
      const paidChargesDetails = await ChargeDetails.find({
        $and: [{ invoice_no }, { billing_status: "paid" }],
      });
      res.status(200).json(paidChargesDetails);
    }
  } catch (error) {
    console.log(error);
  }
};

const singlePaidChargesdetails = async (req, res) => {
  try {
    const charges_details = req.params.id;
    if (!charges_details) {
      res.status(400).json({
        message: "Charges Details ID is missing!",
      });
    } else {
      const paidChargesDetails = await ChargeDetails.findOne({
        $and: [{ _id: ObjectId(charges_details) }, { billing_status: "paid" }],
      });
      res.status(200).json(paidChargesDetails);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  allPendingCharges,
  allPaidCharges,
  sendInvoice,
  getMultipleChargesDetails,
  getSingleChargesDetails,
  allPaidChargesdetails,
  singlePaidChargesdetails,
};
