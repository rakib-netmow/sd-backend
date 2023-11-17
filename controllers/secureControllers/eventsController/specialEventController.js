const SpecialEvent = require("../../../model/events/specialEventModel");

const addSpecialEvent = async (req, res) => {
  const {
    event_name,
    event_vanue,
    image,
    description,
    starts,
    ends,
    options,
    notification,
    visible_to,
  } = req.body;
  const created_by = req.auth.id;
  try {
    if (!event_name) {
      res.status(400).json({
        message: "Event name is required!",
      });
    } else if (!event_vanue) {
      res.status(400).json({
        message: "Event vanue is required!",
      });
    } else if (!description) {
      res.status(400).json({
        message: "Description is required!",
      });
    } else if (!starts) {
      res.status(400).json({
        message: "Start time is required!",
      });
    } else if (!ends) {
      res.status(400).json({
        message: "Ends time is required!",
      });
    } else if (!options) {
      res.status(400).json({
        message: "Options are required!",
      });
    } else if (!notification) {
      res.status(400).json({
        message: "Notification is required!",
      });
    } else if (!visible_to) {
      res.stauts(400).json({
        message: "Visible option is required!",
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

      const newSpecialEvent = await SpecialEvent.create({
        event_name,
        event_vanue,
        // image: uploadedImage,
        description,
        starts,
        ends,
        options,
        notification,
        visible_to,
        created_by,
      });

      if (newSpecialEvent) {
        res.status(200).json({
          message: "New special event is created successfully.",
        });
      } else {
        res.status(400).json({
          message: "Cannot create new event. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allSpecialEvent = async (req, res) => {
  try {
    const created_by = req.auth.id;
    const allSpecialEvents = await SpecialEvent.find({ created_by });
    res.status(200).json(allSpecialEvents);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addSpecialEvent,
  allSpecialEvent,
};
