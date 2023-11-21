const sendLoginCredentials = require("../../../config/credentialEmail");
const Team = require("../../../model/team/teamModel");
const User = require("../../../model/user/userModel");

const addPlayerByGuardian = async (req, res) => {
  const {
    first_name,
    last_name,
    gender,
    date_of_birth,
    height,
    weight,
    address_line_1,
    address_line_2,
    country,
    state,
    city,
    zip,
    email,
    phone,
    password,
    confirm_password,
    team,
    fees,
    description,
  } = req.body;
  const added_by = req.auth.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Email is required!",
      });
    } else if (!password) {
      res.status(400).json({
        message: "Password is required!",
      });
    } else if (!confirm_password) {
      res.status(400).json({
        message: "Confrim password is required!",
      });
    } else if (password !== confirm_password) {
      res.status(400).json({
        message: "Confrim password does not match!",
      });
    } else if (!team) {
      res.status(400).json({
        message: "Team is required!",
      });
    } else if (!fees) {
      res.status(400).json({
        message: "Fees is required!",
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

      const existingPlayer = await User.findOne({ email });
      const existingTeam = await Team.findOne({ _id: team });
      if (!existingPlayer) {
        if (existingTeam?._id) {
          const newPlayer = await User.create({
            email: email,
            password: password,
            team,
            token: generateToken(email),
            fees,
            name: first_name && last_name ? `${first_name} ${last_name}` : "",
            gender: gender ? gender : "",
            date_of_birth: date_of_birth ? date_of_birth : "",
            address_line_1: address_line_1 ? address_line_1 : "",
            address_line_2: address_line_2 ? address_line_2 : "",
            country: country ? country : "",
            city: city ? city : "",
            state: state ? state : "",
            zip: zip ? zip : 0,
            phone: phone ? phone : "",
            height: height ? height : "",
            weight: weight ? weight : "",
            description: description ? description : "",
            added_by,
            guardian: added_by,
            role: "player",
            // profile_image: uploadedImage
          });
          if (newPlayer) {
            sendLoginCredentials(email, password);
            // update the team database model
            await Team.findOneAndUpdate(
              { _id: team },
              {
                $push: {
                  player: newPlayer?._id,
                },
              }
            );
            res.status(200).json({
              message: "Player added successfully.",
            });
          } else {
            res.status(400).json({
              message: "Can not add Player. Please try again!",
            });
          }
        } else {
          res.status(400).json({
            message: "Invalid team ID or can't find any team to assign!",
          });
        }
      } else {
        res.status(400).json({
          message: "Already have an user with this email",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addPlayerByGuardian,
};
