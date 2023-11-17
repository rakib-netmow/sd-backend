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
    }
    // else if (!req.file?.path) {
    //   res.status(400).json({
    //     message: "Image is missing",
    //   });
    // }
    else {
      // ** upload the image
      // const upload = await Cloudinary.uploader.upload(req.file?.path);
      // if (upload?.secure_url) {
      //   let uploadedImage = {};
      //   uploadedImage = {
      //     uploadedImage: upload.secure_url,
      //     uploadedImage_public_url: upload.public_id,
      //   };

      //   // Enter next code there
      // } else {
      //   req.status(400).json({
      //     message: "Image upload faild! Please try again.",
      //   });
      // }

      const newSponsor = await Sponsor.create({
        name,
        website,
        sponsoring,
        start_date,
        end_date,
        description,
        // logo: uploadedImage,
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
