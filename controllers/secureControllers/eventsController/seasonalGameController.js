const SeasonalGame = require("../../../model/events/seasonalGamesModel");

const addSeasonalGame = async (req, res) => {
  const {
    name,
    // host_team_name,
    // host_team_id,
    // guest_team_name,
    // guest_team_id,
    vanue,
    // image,
    description,
    starts,
    ends,
    notification,
    fees,
    visible_to,
  } = req.body;
  const created_by = req.auth.id;
  try {
    if (!name) {
      res.status(400).json({
        message: "Name is required!",
      });
    }
    // else if (!host_team_name) {
    //   res.status(400).json({
    //     message: "Host team name is missing!",
    //   });
    // } else if (!host_team_id) {
    //   res.status(400).json({
    //     message: "Host team ID is missing!",
    //   });
    // } else if (!guest_team_name) {
    //   res.status(400).json({
    //     message: "Guest team name is missing!",
    //   });
    // } else if (!guest_team_id) {
    //   res.status(400).json({
    //     message: "Guest team ID is missing!",
    //   });
    // }
    else if (!starts) {
      res.status(400).json({
        message: "Starts Time is required!",
      });
    } else if (!ends) {
      res.status(400).json({
        message: "Ends Time is required!",
      });
    } else if (!vanue) {
      res.status(400).json({
        message: "Location is required!",
      });
    } else if (!fees) {
      res.status(400).json({
        message: "Fees is required!",
      });
    } else if (!description) {
      res.status(400).json({
        message: "Description is required!",
      });
    } else if (!notification) {
      res.status(400).json({
        message: "Notification is required!",
      });
    } else if (visible_to?.length < 1) {
      res.status(400).json({
        message: "Visible option is required!",
      });
    } else if (typeof visible_to !== "object") {
      res.status(400).json({
        message: "Invalid visible option data type!",
      });
    } else if (
      !notification &&
      (notification.toLowerCase() !== "push notification and email" ||
        notification.toLowerCase() !== "none")
    ) {
      //
      res.status(400).json({
        message: "Invalid notification!",
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

      const newSeasonalGame = await SeasonalGame.create({
        name,
        // host_team_name,
        // host_team_id,
        // guest_team_name,
        // guest_team_id,
        vanue,
        description,
        starts,
        ends,
        notification: notification.toLowerCase(),
        fees,
        visible_to,
        created_by,
        // image: uploadedImage,
      });
      if (newSeasonalGame) {
        res.status(200).json({
          message: "New seasonal game added successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can not add new seasonal game. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allSeasonalGame = async (req, res) => {
  try {
    const created_by = req.auth.id;

    const allSeasonalGames = await SeasonalGame.find({ created_by });
    res.status(200).json(allSeasonalGames);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addSeasonalGame,
  allSeasonalGame,
};
