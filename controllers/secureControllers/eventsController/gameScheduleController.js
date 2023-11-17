// const Cloudinary = require("../../../config/cloudinary.js");
const GameSchedule = require("../../../model/events/gameSchedule");

const addGameSchedule = async (req, res) => {
  const {
    host_team_name,
    host_team_id,
    guest_team_name,
    guest_team_id,
    // team,
    vanue,
    game_name,
    date,
    time,
    // image,
    description,
    status,
  } = req.body;
  const created_by = req.auth.id;
  try {
    if (!host_team_name) {
      res.status(400).json({
        message: "Host team name is missing!",
      });
    } else if (!host_team_id) {
      res.status(400).json({
        message: "Host team ID is missing!",
      });
    } else if (!guest_team_name) {
      res.status(400).json({
        message: "Guest team name is missing!",
      });
    } else if (!guest_team_id) {
      res.status(400).json({
        message: "Guest team ID is missing!",
      });
    } else if (!vanue) {
      res.status(400).json({
        message: "Venu is missing!",
      });
    } else if (!game_name) {
      res.status(400).json({
        message: "Game name is missing!",
      });
    } else if (!date) {
      res.status(400).json({
        message: "Date is missing!",
      });
    } else if (!time) {
      res.status(400).json({
        message: "Time is missing!",
      });
    } else if (!description) {
      res.status(400).json({
        message: "Description is missing!",
      });
    } else if (!status) {
      res.status(400).json({
        message: "Status is missing!",
      });
    } else if (!status && (status !== "active" || status !== "inactive")) {
      res.status(400).json({
        message: "Invalid status!",
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

      const newGameSchedule = await GameSchedule.create({
        host_team_name,
        host_team_id,
        guest_team_name,
        guest_team_id,
        // team,
        vanue,
        game_name,
        date,
        time,
        description,
        status,
        // image: uploadedImage,
        created_by,
      });

      if (newGameSchedule) {
        res.status(200).json({
          message: "New Game Schedule Created Successfully.",
        });
      } else {
        res.status(400).json({
          message: "Can not create new game schedule. Plase try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allGameSchedule = async (req, res) => {
  try {
    const created_by = req.auth.id;

    const allGameSchedules = await GameSchedule.find({ created_by });
    res.status(200).json(allGameSchedules);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addGameSchedule,
  allGameSchedule,
};
