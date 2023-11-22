const isValidObjectId = require("../../../config/checkValidObjectId");
const CnameSetting = require("../../../model/settings/cnameSettingModel");
const DnsSetting = require("../../../model/settings/dnsSettingModel");
const DomainSetting = require("../../../model/settings/domainSettingModel");
const NsSetting = require("../../../model/settings/nsSettingModel");

const addDomain = async (req, res) => {
  try {
    const { domain_name } = req.body;
    const created_by = req.auth.id;
    if (!domain_name) {
      res.status(400).json({
        message: "Domain name is missing!",
      });
    } else {
      const domain = await DomainSetting.create({
        domain_name,
        created_by,
      });

      if (domain) {
        res.status(200).json({
          message: "Domain added successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can't add domain. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const addDns = async (req, res) => {
  try {
    const { host_name, value } = req.body;
    const created_by = req.auth.id;
    if (!host_name) {
      res.status(400).json({
        message: "Host name is missing!",
      });
    } else if (!value) {
      res.status(400).json({
        message: "Value is missing!",
      });
    } else {
      const newDns = await DnsSetting.create({
        host_name,
        value,
        created_by,
      });
      if (newDns) {
        res.status(200).json({
          message: "DNS record added successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can't add DNS record. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const AllDns = async (req, res) => {
  try {
    const created_by = req.auth.id;
    const Dns = await DnsSetting.find({ created_by });

    res.status(200).json(Dns);
  } catch (error) {
    console.log(error);
  }
};

const updateDns = async (req, res) => {
  const data = req.body;
  const created_by = req.auth.id;
  const id = req?.params?.id;
  try {
    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid DNS ID",
      });
    } else {
      const newDns = await DnsSetting.findOneAndUpdate(
        {
          $and: [{ _id: id }, { created_by }],
        },
        data
      );
      if (newDns) {
        res.status(200).json({
          message: "DNS record updated successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can't update DNS record. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteDns = async (req, res) => {
  try {
    const id = req?.params?.id;
    const created_by = req.auth.id;
    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid DNS ID",
      });
    } else {
      const dns = await DnsSetting.findOneAndDelete({
        $and: [{ _id: id }, { created_by }],
      });
      if (dns) {
        res.status(200).json({
          message: "DNS record deleted succefully.",
        });
      } else {
        res.status(400).json({
          message: "Cant not delete DNS record. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const addNs = async (req, res) => {
  try {
    const { host_name, value } = req.body;
    const created_by = req.auth.id;
    if (!host_name) {
      res.status(400).json({
        message: "Host name is missing!",
      });
    } else if (!value) {
      res.status(400).json({
        message: "Value is missing!",
      });
    } else {
      const newNs = await NsSetting.create({
        host_name,
        value,
        created_by,
      });
      if (newNs) {
        res.status(200).json({
          message: "NS record added successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can't add NS record. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const AllNs = async (req, res) => {
  try {
    const created_by = req.auth.id;
    const ns = await NsSetting.find({ created_by });

    res.status(200).json(ns);
  } catch (error) {
    console.log(error);
  }
};

const updateNs = async (req, res) => {
  const data = req.body;
  const created_by = req.auth.id;
  const id = req?.params?.id;
  try {
    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid NS ID",
      });
    } else {
      const newNs = await NsSetting.findOneAndUpdate(
        {
          $and: [{ _id: id }, { created_by }],
        },
        data
      );
      if (newNs) {
        res.status(200).json({
          message: "NS record updated successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can't update NS record. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteNs = async (req, res) => {
  try {
    const id = req?.params?.id;
    const created_by = req.auth.id;
    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid NS ID",
      });
    } else {
      const ns = await NsSetting.findOneAndDelete({
        $and: [{ _id: id }, { created_by }],
      });
      if (ns) {
        res.status(200).json({
          message: "NS record deleted succefully.",
        });
      } else {
        res.status(400).json({
          message: "Cant not delete NS record. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const addCname = async (req, res) => {
  try {
    const { host_name, value } = req.body;
    const created_by = req.auth.id;
    if (!host_name) {
      res.status(400).json({
        message: "Host name is missing!",
      });
    } else if (!value) {
      res.status(400).json({
        message: "Value is missing!",
      });
    } else {
      const newCname = await CnameSetting.create({
        host_name,
        value,
        created_by,
      });
      if (newCname) {
        res.status(200).json({
          message: "CNAME record added successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can't add CNAME record. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const AllCname = async (req, res) => {
  try {
    const created_by = req.auth.id;
    const Cname = await CnameSetting.find({ created_by });

    res.status(200).json(Cname);
  } catch (error) {
    console.log(error);
  }
};

const updateCname = async (req, res) => {
  const data = req.body;
  const created_by = req.auth.id;
  const id = req?.params?.id;
  try {
    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Cname ID",
      });
    } else {
      const newCname = await CnameSetting.findOneAndUpdate(
        {
          $and: [{ _id: id }, { created_by }],
        },
        data
      );
      if (newCname) {
        res.status(200).json({
          message: "CNAME record updated successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can't update CNAME record. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteCname = async (req, res) => {
  try {
    const id = req?.params?.id;
    const created_by = req.auth.id;
    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Cname ID",
      });
    } else {
      const cname = await CnameSetting.findOneAndDelete({
        $and: [{ _id: id }, { created_by }],
      });
      if (cname) {
        res.status(200).json({
          message: "CNAME record deleted succefully.",
        });
      } else {
        res.status(400).json({
          message: "Cant not delete CNAME record. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addDomain,
  addDns,
  AllDns,
  updateDns,
  deleteDns,
  addNs,
  AllNs,
  updateNs,
  deleteNs,
  addCname,
  AllCname,
  updateCname,
  deleteCname,
};
