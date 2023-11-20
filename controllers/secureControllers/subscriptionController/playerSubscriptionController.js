const PlayerSubscription = require("../../../model/subscription/playerSubscriptionModel");

const addPlayerSubscription = async (req, res) => {
  const {
    name,
    fee,
    create_date,
    end_date,
    select_team,
    select_team_id,
    description,
  } = req.body;
  const created_by = req.auth.id;
  try {
    if (!fee) {
      res.status(400).json({
        message: "Fee is required!",
      });
    } else if (!name) {
      res.status(400).json({
        message: "Name field is required!",
      });
    } else if (!select_team) {
      res.status(400).json({
        message: "Select team field is required!",
      });
    } else if (!select_team_id) {
      res.status(400).json({
        message: "Select team field ID is required!",
      });
    } else if (!end_date) {
      res.status(400).json({
        message: "End date is required!",
      });
    } else if (!create_date) {
      res.status(400).json({
        message: "created date is required!",
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

      const newPlayersubscription = await PlayerSubscription.create({
        name,
        fee,
        create_date,
        end_date,
        select_team,
        select_team_id,
        description,
        // image: uploadedImage,
        created_by,
      });

      if (newPlayersubscription) {
        res.status(200).json({
          message: "New player subscription is added successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can not create new subscription. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allPlayerSubscription = async (req, res) => {
  try {
    const created_by = req.auth.id;
    const allPlayerSubcriptions = await PlayerSubscription.find({ created_by });
    res.status(200).json(allPlayerSubcriptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addPlayerSubscription,
  allPlayerSubscription,
};
