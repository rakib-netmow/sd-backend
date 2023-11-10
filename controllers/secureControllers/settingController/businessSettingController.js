const BusinessSetting = require("../../../model/settings/businessSettingModel");

const changeBusinessSetting = async (req, res) => {
  try {
    const data = req.body;
    const created_by = req.auth.id;

    const newBusinessSetting = await BusinessSetting.findOneAndUpdate(
      {
        $and: [{ created_by }],
      },
      data
    );
    if (newBusinessSetting) {
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

const addBusinessSetting = async (req, res) => {
  try {
    const {
      company_name,
      short_info,
      address1,
      address2,
      state,
      city,
      zip,
      website,
      phone,
      email,
    } = req.body;
    const created_by = req.auth.id;
    if (!company_name) {
      res.status(400).json({ message: "Company name is missing!" });
    } else if (!short_info) {
      res.status(400).json({ message: "Short info name is missing!" });
    } else if (!address1 || !address2) {
      res.status(400).json({ message: "Address is missing!" });
    } else if (!state) {
      res.status(400).json({ message: "State is missing!" });
    } else if (!city) {
      res.status(400).json({ message: "City is missing!" });
    } else if (!zip) {
      res.status(400).json({ message: "Zip code is missing!" });
    } else if (!phone) {
      res.status(400).json({ message: "Phone number is missing!" });
    } else if (!email) {
      res.status(400).json({ message: "Email is missing!" });
    } else {
      const newBusinessSetting = await BusinessSetting.create({
        company_name,
        short_info,
        address1,
        address2,
        state,
        city,
        zip,
        website: website ? website : "",
        phone,
        email,
        created_by,
      });
      if (newBusinessSetting) {
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

const allBusinessSetting = async (req, res) => {
  const created_by = req.auth.id;
  try {
    const businessSetting = await BusinessSetting.findOne({ created_by });
    res.status(200).json(businessSetting);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  changeBusinessSetting,
  allBusinessSetting,
  addBusinessSetting,
};
