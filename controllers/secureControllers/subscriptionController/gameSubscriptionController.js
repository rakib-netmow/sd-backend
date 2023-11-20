const GameSubscription = require("../../../model/subscription/gameSubscriptionModel");

const addGameSubscription = async (req, res) => {
  const { name, fee, create_date, end_date, description } = req.body;
  const created_by = req.auth.id;
  try {
    if (!name) {
      res.status(400).json({
        message: "Name is required!",
      });
    } else if (!fee) {
      res.status(400).json({
        message: "Fee is required!",
      });
    } else if (!create_date) {
      res.status(400).json({
        message: "Created date is required!",
      });
    } else if (!end_date) {
      res.status(400).json({
        message: "End date is required!",
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

      const newGameSubscription = await GameSubscription.create({
        name,
        fee,
        create_date,
        end_date,
        description,
        // image: uploadedImage,
        created_by,
      });
      if (newGameSubscription) {
        res.status(200).json({
          message: "New game subscription added successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can not create new game subscription. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allGameSubscription = async (req, res) => {
  try {
    const created_by = req.auth.id;
    const allGameSubscriptions = await GameSubscription.find({ created_by });
    res.status(200).json(allGameSubscriptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addGameSubscription,
  allGameSubscription,
};
