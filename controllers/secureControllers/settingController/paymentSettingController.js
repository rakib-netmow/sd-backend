const PaypalSetting = require("../../../model/settings/paypalSettingModel");
const SslcommerzSetting = require("../../../model/settings/sslcommerzSettingModel");
const StripeSetting = require("../../../model/settings/stripeSettingModel");

const addStripe = async (req, res) => {
  try {
    const { stripe_key, stripe_secret } = req.body;
    const created_by = req.auth.id;
    const existingStripe = await StripeSetting.findOne({ created_by });
    if (existingStripe?.stripe_key) {
      const updateStripe = await StripeSetting.findOneAndUpdate(
        {
          $and: [{ created_by }, { stripe_key: existingStripe?.stripe_key }],
        },
        req?.body
      );
      if (updateStripe) {
        res.status(200).json({
          message: "Saved changes.",
        });
      } else {
        res.status(400).json({
          message: "Can't save changed!",
        });
      }
    } else {
      if (!stripe_key) {
        res.status(400).json({
          message: "Stripe Key is missing!",
        });
      } else if (!stripe_secret) {
        res.status(400).json({
          message: "Stripe Secret is missing!",
        });
      } else {
        const newStripe = await StripeSetting.create({
          stripe_key,
          stripe_secret,
          created_by,
        });
        if (newStripe) {
          res.status(200).json({
            message: "Saved changes.",
          });
        } else {
          res.status(400).json({
            message: "Can't save changed!",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const addPaypal = async (req, res) => {
  try {
    const { account_number, private_key } = req.body;
    const created_by = req.auth.id;
    const existingPaypal = await PaypalSetting.findOne({ created_by });
    if (existingPaypal?.account_number) {
      const updatePaypal = await PaypalSetting.findOneAndUpdate(
        {
          $and: [
            { created_by },
            { account_number: existingPaypal?.account_number },
          ],
        },
        req?.body
      );
      if (updatePaypal) {
        res.status(200).json({
          message: "Saved changes.",
        });
      } else {
        res.status(400).json({
          message: "Can't save changed!",
        });
      }
    } else {
      if (!account_number) {
        res.status(400).json({
          message: "Account number is missing!",
        });
      } else if (!private_key) {
        res.status(400).json({
          message: "Private key is missing!",
        });
      } else {
        const newPaypal = await PaypalSetting.create({
          account_number,
          private_key,
          created_by,
        });
        if (newPaypal) {
          res.status(200).json({
            message: "Saved changes.",
          });
        } else {
          res.status(400).json({
            message: "Can't save changed!",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const addSslcommerz = async (req, res) => {
  try {
    const { account_number, private_key } = req.body;
    const created_by = req.auth.id;
    const existingSsl = await SslcommerzSetting.findOne({ created_by });
    if (existingSsl?.account_number) {
      const updateSsl = await SslcommerzSetting.findOneAndUpdate(
        {
          $and: [
            { created_by },
            { account_number: existingSsl?.account_number },
          ],
        },
        req?.body
      );
      if (updateSsl) {
        res.status(200).json({
          message: "Saved changes.",
        });
      } else {
        res.status(400).json({
          message: "Can't save changed!",
        });
      }
    } else {
      if (!account_number) {
        res.status(400).json({
          message: "Account number is missing!",
        });
      } else if (!private_key) {
        res.status(400).json({
          message: "Private key is missing!",
        });
      } else {
        const newSsl = await SslcommerzSetting.create({
          account_number,
          private_key,
          created_by,
        });
        if (newSsl) {
          res.status(200).json({
            message: "Saved changes.",
          });
        } else {
          res.status(400).json({
            message: "Can't save changed!",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addStripe,
  addPaypal,
  addSslcommerz,
};
