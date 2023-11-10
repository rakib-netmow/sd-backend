const CurrencySetting = require("../../../model/settings/currencySettingModel");

const changeCurrency = async (req, res) => {
  try {
    const data = req.body;
    const created_by = req.auth.id;

    const newCurrency = await CurrencySetting.findOneAndUpdate(
      {
        $and: [{ created_by }],
      },
      data
    );
    if (newCurrency) {
      res.status(200).json({
        message: "Infromation updated successfully.",
      });
    } else {
      res.status(400).json({
        message: "Can't update information. Please try again!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const addCurrency = async (req, res) => {
  try {
    const { gst, currency } = req.body;
    const created_by = req.auth.id;
    if (!gst) {
      res.status(400).json({ message: "Company name is missing!" });
    } else if (!currency) {
      res.status(400).json({ message: "Short info name is missing!" });
    } else {
      const newCurrency = await CurrencySetting.create({
        gst,
        currency,
        created_by,
      });
      if (newCurrency) {
        res.status(200).json({
          message: "Infromation updated successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can't update information. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getCurrency = async (req, res) => {
  const created_by = req.auth.id;
  try {
    const newCurrency = await CurrencySetting.findOne({ created_by });
    res.status(200).json(newCurrency);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  changeCurrency,
  getCurrency,
  addCurrency,
};
