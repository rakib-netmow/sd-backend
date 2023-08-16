const Sponsor = require("../../../model/sponsor/sponsorModel");

const addSponsor = async (req, res) => {
  const {
    name,
    website,
    // logo,
    sponsoring,
    start_date,
    end_date,
    description,
  } = req.body;
  const created_by = req.auth.id;
  try {
    if (!name) {
      res.status(400).json({
        message: "Name is required!",
      });
    } else if (!website) {
      res.status(400).json({
        message: "Website is required!",
      });
    } else if (!sponsoring) {
      res.status(400).json({
        message: "Sponsoring team/event is required!",
      });
    } else if (!start_date) {
      res.status(400).json({
        message: "Starting date is required!",
      });
    } else if (!end_date) {
      res.status(400).json({
        message: "Ending date is required!",
      });
    } else if (!description) {
      res.status(400).json({
        message: "Description is required!",
      });
    } else {
      const newSponsor = await Sponsor.create({
        name,
        website,
        sponsoring,
        start_date,
        end_date,
        description,
        created_by,
      });

      if (newSponsor) {
        res.status(200).json({
          message: "New sponsor is created successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can not create new sponsor. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allSponsor = async (req, res) => {
  try {
    const created_by = req.auth.id;
    const allSponsors = await Sponsor.find({ created_by });
    res.status(200).json(allSponsors);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addSponsor,
  allSponsor,
};
