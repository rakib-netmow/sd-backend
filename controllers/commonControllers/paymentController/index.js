const Transaction = require("../../../model/transactions/transactionsModel");
const User = require("../../../model/user/userModel");
const Wallet = require("../../../model/wallet/walletModel");

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
        const system = await SystemAuthority.findOne({});
        const transaction = await Transaction.create({
          payment_for_title: "admin charges payment",
          payment_for_id: admin?._id,
          amount: system?.core_charge ? parseFloat(system?.core_charge) : 1,
          payment_method,
          status: "paid",
          admin_email: admin?.email,
        });
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
                    (system?.core_charge ? parseFloat(system?.core_charge) : 1),
                },
              }
            );
            if (updateWallet) {
              //
              res.status(200).json({
                message: "Transaction successfull.",
              });
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
