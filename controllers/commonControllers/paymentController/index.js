const Transaction = require("../../../model/transactions/transactionsModel");
const User = require("../../../model/user/userModel");

const stripe = require("stripe")(
  "sk_test_51OCaMgARQHH6709REaISge4YZ8H5QrqqnrEuTADzvS4ocBmrrfL5TQyYj9d5KFkE29f8Xzb4YmewmWCCIOqRKIyt00ZRnBGHJ2"
);

const stripePaymentIntent = async (req, res) => {
  try {
    const { price } = req.body;
    const amount = price * 100;
    const intent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "aud",
      payment_method_types: ["card"],
      metadata: {
        email: "ahsun@mail.com",
        name: "Ahsun",
        address: "Bogra Sadar",
      },
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
    const { payment_for, amount, transaction_id, payment_method } = req.body;
    const payment_by = req.auth.id;
    const status = "";
    const admin = await User.findOne({ email: payment_by });
    if (!payment_for) {
      res.status(400).json({
        message: "Payment for is missing!",
      });
    } else if (!amount) {
      res.status(400).json({
        message: "Amount is missing!",
      });
    } else if (!transaction_id) {
      res.status(400).json({
        message: "Transaction ID is missing!",
      });
    } else if (!payment_method) {
      res.status(400).json({
        message: "Payment method is missing!",
      });
    } else {
      if (admin && admin?.email) {
        const transaction = await Transaction.create({
          payment_by,
          payment_for,
          amount,
          transaction_id,
          payment_method,
          status: "pending",
          admin_email: admin?.email,
        });
        if (transaction) {
          res.status(200).json({
            message: "Transaction successfull.",
          });
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
