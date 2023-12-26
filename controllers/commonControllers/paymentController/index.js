const { ObjectId } = require("mongodb");
const SubInvoice = require("../../../model/invoice/subInvoiceModel");
const Transaction = require("../../../model/transactions/transactionsModel");
const User = require("../../../model/user/userModel");
const Wallet = require("../../../model/wallet/walletModel");
const SubChargeDetails = require("../../../model/invoice/subChargeDetails");
const ChargeDetails = require("../../../model/invoice/chargeDetailsModel");
const moment = require("moment");
const stripe = require("stripe")(
  "sk_test_51OCaMgARQHH6709REaISge4YZ8H5QrqqnrEuTADzvS4ocBmrrfL5TQyYj9d5KFkE29f8Xzb4YmewmWCCIOqRKIyt00ZRnBGHJ2"
);

const stripePaymentIntent = async (req, res) => {
  try {
    const { price, name, email, address } = req.body;
    const amount = price * 100;
    const customer = await stripe.customers.create({
      email: email,
      name: name,
    });
    const intent = await stripe.paymentIntents.create({
      customer: customer.id,
      amount: amount,
      currency: "aud",
      payment_method_types: ["card"],
      metadata: {
        address,
      },
    });
    await stripe.customers.update(customer.id, {
      email: email,
      name: name,
    });
    if (intent) {
      res.status(200).json({
        clientSecret: intent.client_secret,
      });
    } else {
      res.status(400).json({
        message: "Something wrong",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.toString(),
    });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { invoice_no, amount, chargesDetails, payment_method } = req.body;
    const payment_by = req.auth.id;
    const admin = await User.findOne({ email: payment_by });
    if (!invoice_no) {
      res.status(400).json({
        message: "invoice no is missing!",
      });
    } else if (!amount) {
      res.status(400).json({
        message: "Amount is missing!",
      });
    } else if (
      !chargesDetails ||
      typeof chargesDetails !== "object" ||
      chargesDetails?.length <= 0
    ) {
      res.status(400).json({
        message: "charges details is missing!",
      });
    } else if (!payment_method) {
      res.status(400).json({
        message: "Payment method is missing!",
      });
    } else {
      if (admin && admin?.email) {
        const system = await SystemAuthority.findOne({});
        // create multiple transactions
        // prepare transaction object for insert
        const transactionDoc = chargesDetails?.map((c) => {
          return {
            payment_for_title: "admin charges payment",
            payment_for_id: c?.chargesDetailsId,
            amount: system?.core_charge ? parseFloat(system?.core_charge) : 1,
            payment_method,
            status: "paid",
            admin_email: admin?.email,
          };
        });

        // filter charges details id's
        const chargesDetailsDoc = chargesDetails?.map((c) =>
          ObjectId(c?.chargesDetailsId)
        );

        // filter subinvoice id's
        const subInvoiceDoc = chargesDetails.map((c) => {
          return ObjectId(c.subInvoiceId);
        });

        const transaction = await Transaction.create(transactionDoc);

        if (transaction) {
          // update wallet
          const wallet = await Wallet.findOne({
            $and: [{ admin_id: admin?._id }, { created_by: admin?.email }],
          });
          if (wallet?._id) {
            const updateWallet = await Wallet.findOneAndUpdate(
              {
                $and: [{ admin_id: admin?._id }, { created_by: admin?.email }],
              },
              {
                $set: {
                  total_charges:
                    parseFloat(wallet?.total_charges) -
                    (system?.core_charge
                      ? parseFloat(system?.core_charge) * chargesDetails?.length
                      : chargesDetails?.length),
                },
              }
            );
            if (updateWallet) {
              // update charges details's billing_status to paid....
              const updateChargesDetails = await ChargeDetails.updateMany(
                { _id: { $in: chargesDetailsDoc } },
                {
                  $set: {
                    billing_status: "paid",
                  },
                }
              );
              if (updateChargesDetails) {
                // find all sub charges details
                const allSubInvoices = await SubInvoice.find({
                  _id: { $in: subInvoiceDoc },
                }).select("charges_details.id");
                if (allSubInvoices?.length > 0) {
                  // update last_payment_date ....
                  const updateSubInvoice = await SubInvoice.updateMany(
                    { _id: { $in: subInvoiceDoc } },
                    {
                      $set: {
                        last_payment_date: moment().format(),
                      },
                    }
                  );
                  if (updateSubInvoice) {
                    // filter sub charges id's
                    const subChargesDoc = allSubInvoices?.map((s) =>
                      ObjectId(s?.chargesDetails?.id)
                    );
                    // update billing_status to paid...
                    const updateSubChargesDetails =
                      await SubChargeDetails.updateMany(
                        { _id: { $in: subChargesDoc } },
                        {
                          $set: {
                            billing_status: "paid",
                          },
                        }
                      );
                    if (updateSubChargesDetails) {
                      // remove charges details element from main invoice
                      const updateInvoice = await Invoice.findOneAndUpdate(
                        {
                          _id: ObjectId("656f4192059bf4f4b5c68d7c"),
                        },
                        {
                          $pull: {
                            charges_details: {
                              chargesDetailsId: { $in: chargesDetailsDoc },
                            },
                          },
                        }
                      );
                      if (updateInvoice) {
                        res.status(200).json({
                          message: "Transaction successfull.",
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          res.status(400).json({
            message: "Transaction faild!",
          });
        }
        if (transaction) {
          res.status(200).json(transaction);
        } else {
          res.status(400).json({ message: "Something wrong" });
        }
      } else {
        res.status(400).json({
          message: "Can't find Admin account!",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error.toString(),
    });
  }
};
const myTransaction = async (req, res) => {
  try {
    const payment_by = req.auth.id;
    const transactions = await Transaction.find({ payment_by });
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  stripePaymentIntent,
  createTransaction,
  myTransaction,
};
