const { generateToken } = require("../../../config/generateToken");
const User = require("../../../model/user/userModel");
const Cloudinary = require("../../../config/cloudinary.js");
const sendLoginCredentials = require("../../../config/credentialEmail.js");
const Team = require("../../../model/team/teamModel.js");
const isValidObjectId = require("../../../config/checkValidObjectId.js");
const { ObjectId } = require("mongodb");

const addPlayer = async (req, res) => {
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
    }
    //  else if (!team) {
    //   res.status(400).json({
    //     message: "Team is required!",
    //   });
    // } else if (!isValidObjectId(team)) {
    //   res.status(400).json({
    //     message: "Invalid team ID!",
    //   });
    // }
    else if (!fees) {
      res.status(400).json({
        message: "Fees is required!",
      });
    } else if (!req.file?.path) {
      res.status(400).json({
        message: "Image is missing",
      });
    } else {
      // ** upload the image
      const upload = await Cloudinary.uploader.upload(req.file?.path);
      if (upload?.secure_url) {
        let uploadedImage = {};
        uploadedImage = {
          uploadedImage: upload.secure_url,
          uploadedImage_public_url: upload.public_id,
        };

        // Enter next code there
        const existingPlayer = await User.findOne({ email });
        if (!existingPlayer) {
          if (team && isValidObjectId(team)) {
            const existingTeam = await Team.findOne({ _id: team });
            if (existingTeam?._id) {
              const newPlayer = await User.create({
                email: email,
                password: password,
                team: [team],
                team_names: [existingTeam?.name],
                token: generateToken(email),
                fees,
                name:
                  first_name && last_name ? `${first_name} ${last_name}` : "",
                gender: gender ? gender : "",
                date_of_birth: date_of_birth ? date_of_birth : "",
                address_line_1: address_line_1 ? address_line_1 : "",
                address_line_2: address_line_2 ? address_line_2 : "",
                country: country ? country : "",
                city: city ? city : "",
                state: state ? state : "",
                zip: zip ? parseInt(zip) : 0,
                phone: phone ? phone : "",
                height: height ? height : "",
                weight: weight ? weight : "",
                description: description ? description : "",
                added_by,
                role: "player",
                profile_image: uploadedImage,
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
                    $inc: {
                      total_player: 1,
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
                message: "Invalid team ID or can't find any team to assing!",
              });
            }
          } else {
            const newPlayer = await User.create({
              email: email,
              password: password,
              team: [],
              team_names: [],
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
              zip: zip ? parseInt(zip) : 0,
              phone: phone ? phone : "",
              height: height ? height : "",
              weight: weight ? weight : "",
              description: description ? description : "",
              added_by,
              role: "player",
              profile_image: uploadedImage,
            });
            if (newPlayer) {
              sendLoginCredentials(email, password);
              const {
                password: passwordHashed,
                token,
                ...sanitizedData
              } = newPlayer?._doc;
              res.status(200).json(sanitizedData);
            } else {
              res.status(400).json({
                message: "Can not add Player. Please try again!",
              });
            }
          }
        } else {
          res.status(400).json({
            message: "Already have an user with this email",
          });
        }
      } else {
        req.status(400).json({
          message: "Image upload faild! Please try again.",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allPlayer = async (req, res) => {
  const email = req.auth.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Authentication error",
      });
    } else {
      const players = await User.find({
        $and: [{ added_by: email }, { role: "player" }],
      }).select(["-password", "-token"]);

      res.status(200).json(players);
    }
  } catch (error) {
    console.log(error);
  }
};

const singlePlayer = async (req, res) => {
  const email = req.auth.id;
  const id = req?.params?.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Authentication error",
      });
    } else if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Player ID",
      });
    } else {
      const players = await User.findOne({
        $and: [{ _id: id }, { added_by: email }, { role: "player" }],
      }).select(["-password", "-token"]);

      res.status(200).json(players);
    }
  } catch (error) {
    console.log(error);
  }
};

const totalPlayer = async (req, res) => {
  const email = req.auth.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Authentication error",
      });
    } else {
      const players = await User.find({
        $and: [{ added_by: email }, { role: "player" }],
      }).select(["-password", "-token"]);

      res.status(200).json({ totalPlayers: players.length });
    }
  } catch (error) {
    console.log(error);
  }
};

const latestPlayer = async (req, res) => {
  const email = req.auth.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Authentication error",
      });
    } else {
      const players = await User.find({
        $and: [{ added_by: email }, { role: "player" }],
      })
        .select(["-password", "-token"])
        .sort({ createdAt: 1 });

      res.status(200).json(players);
    }
  } catch (error) {
    console.log(error);
  }
};

const updatePlayer = async (req, res) => {
  const data = req.body;
  const added_by = req.auth.id;
  const id = req?.params?.id;
  try {
    if (data?.email || data?.username) {
      res.status(400).json({
        message: "You can't change your email or username!",
      });
    } else if (data?.password && data?.password !== data?.confirm_password) {
      res.status(400).json({
        message: "Confrim password is not matched!",
      });
    } else if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Player ID",
      });
    } else {
      const player = await User.findOneAndUpdate(
        {
          $and: [{ _id: id }, { added_by }],
        },
        data
      );

      if (player) {
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

const deletePlayer = async (req, res) => {
  try {
    const id = req?.params?.id;
    const added_by = req.auth.id;

    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Player ID",
      });
    } else {
      const player = await User.findOne({ _id: id });
      if (player?.guardian && isValidObjectId(player.guardian)) {
        const guardian = await User.findOne({ _id: player?.guardian });
        if (guardian && player?.payment_status === "unpaid") {
          await User.findOneAndUpdate(
            { _id: guardian?._id },
            {
              $inc: {
                total_player: -1,
                inactive_player: -1,
              },
            }
          );
        } else {
          await User.findOneAndUpdate(
            { _id: guardian?._id },
            {
              $inc: {
                total_player: -1,
                active_player: -1,
              },
            }
          );
        }
      }
      if (player?.team?.length > 0) {
        player?.team?.map(
          async (t) =>
            isValidObjectId(t) &&
            (await Team.findOneAndUpdate(
              { _id: ObjectId(t) },
              {
                $pull: { player: player?._id },
                $inc: { total_player: -1 },
              }
            ))
        );
      }
      const deletePlayer = await User.findOneAndDelete({ _id: id });
      if (deletePlayer) {
        res.status(200).json({
          message: "Player deleted syccessfully.",
        });
      } else {
        res.status(400).json({
          message: "Faild to delete Player. Please try again.",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const assignTeam = async (req, res) => {
  try {
    const { team_id } = req.body;
    const id = req?.params?.id;
    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Player ID",
      });
    } else if (!isValidObjectId(team_id)) {
      res.status(400).json({
        message: "Invalid Team ID",
      });
    } else {
      const getTeam = await Team.findOne({ _id: team_id });
      if (getTeam?._id) {
        const assign = await User.findOneAndUpdate(
          { _id: id },
          {
            $push: {
              team: team_id,
              team_names: getTeam?.name,
            },
          }
        );
        if (assign) {
          await Team.findOneAndUpdate(
            { _id: team_id },
            {
              $push: {
                team: id,
              },
              $inc: {
                total_player: 1,
              },
            }
          );
          res.status(200).json({
            message: "Team assigned successfully.",
          });
        } else {
          res.status(400).json({
            message: "Can't assign Team. Please try again!",
          });
        }
      } else {
        res.status(400).json({
          message: "Can't find Team!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const addPlayerForGuardian = async (req, res) => {
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
  const guardian_id = req?.params?.id;
  try {
    if (!email) {
      res.status(400).json({
        message: "Email is required!",
      });
    } else if (!password) {
      res.status(400).json({
        message: "Password is required!",
      });
    } else if (!guardian_id) {
      res.status(400).json({
        message: "Guardian ID is required!",
      });
    } else if (!isValidObjectId(guardian_id)) {
      res.status(400).json({
        message: "Invalid Guardian ID",
      });
    } else if (!confirm_password) {
      res.status(400).json({
        message: "Confirm password is required!",
      });
    } else if (password !== confirm_password) {
      res.status(400).json({
        message: "Confirm password does not match!",
      });
    }
    //  else if (!team) {
    //   res.status(400).json({
    //     message: "Team is required!",
    //   });
    // } else if (!isValidObjectId(team)) {
    //   res.status(400).json({
    //     message: "Invalid team ID!",
    //   });
    // }
    else if (!fees) {
      res.status(400).json({
        message: "Fees is required!",
      });
    } else if (!req.file?.path) {
      res.status(400).json({
        message: "Image is missing",
      });
    } else {
      // ** upload the image
      const upload = await Cloudinary.uploader.upload(req.file?.path);
      if (upload?.secure_url) {
        let uploadedImage = {};
        uploadedImage = {
          uploadedImage: upload.secure_url,
          uploadedImage_public_url: upload.public_id,
        };

        // Enter next code there
        const existingPlayer = await User.findOne({ email });
        const guardian = await User.findOne({ _id: guardian_id });
        if (!existingPlayer && guardian?._id) {
          if (team && isValidObjectId(team)) {
            const existingTeam = await Team.findOne({ _id: team });
            if (existingTeam?._id) {
              const newPlayer = await User.create({
                email: email,
                password: password,
                team: [team],
                team_names: [existingTeam?.name],
                token: generateToken(email),
                fees,
                name:
                  first_name && last_name ? `${first_name} ${last_name}` : "",
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
                guardian: guardian_id,
                guardian_name: guardian?.name,
                guardian_email: guardian?.email,
                guardian_phone: guardian?.phone,
                guardian_image: guardian?.profile_image?.uploadedImage
                  ? guardian?.profile_image?.uploadedImage
                  : "",
                role: "player",
                profile_image: uploadedImage,
              });
              if (newPlayer) {
                sendLoginCredentials(email, password);
                // update the Guardian's active/inactive players in database model
                await User.findOneAndUpdate(
                  { _id: guardian_id },
                  {
                    $inc: {
                      inactive_player: 1,
                      total_player: 1,
                    },
                  }
                );
                // update the team database model
                await Team.findOneAndUpdate(
                  { _id: team },
                  {
                    $push: {
                      player: newPlayer?._id,
                    },
                    $inc: {
                      total_player: 1,
                    },
                  }
                );
                const {
                  password: passwordHashed,
                  token,
                  ...sanitizedData
                } = newPlayer?._doc;
                res.status(200).json(sanitizedData);
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
            const newPlayer = await User.create({
              email: email,
              password: password,
              team: [],
              team_names: [],
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
              guardian: guardian_id,
              guardian_name: guardian?.name,
              guardian_email: guardian?.email,
              guardian_phone: guardian?.phone,
              guardian_image: guardian?.profile_image?.uploadedImage
                ? guardian?.profile_image?.uploadedImage
                : "",
              role: "player",
              profile_image: uploadedImage,
            });
            if (newPlayer) {
              sendLoginCredentials(email, password);
              // update the Guardian's active/inactive players in database model
              await User.findOneAndUpdate(
                { _id: guardian_id },
                {
                  $inc: {
                    inactive_player: 1,
                    total_player: 1,
                  },
                }
              );
              const {
                password: passwordHashed,
                token,
                ...sanitizedData
              } = newPlayer?._doc;
              res.status(200).json(sanitizedData);
            } else {
              res.status(400).json({
                message: "Can not add Player. Please try again!",
              });
            }
          }
        } else {
          res.status(400).json({
            message: "Already have an user with this email",
          });
        }
      } else {
        req.status(400).json({
          message: "Image upload faild! Please try again.",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allPlayersForGuardian = async (req, res) => {
  try {
    const guardian_id = req?.params?.id;
    const added_by = req.auth.id;
    if (!isValidObjectId(guardian_id)) {
      res.status(400).json({
        message: "Invalid Guardian ID",
      });
    } else {
      const players = await User.find({
        $and: [{ added_by }, { guardian: guardian_id }],
      }).select(["-password", "-token"]);
      res.status(200).json(players);
    }
  } catch (error) {
    console.log(error);
  }
};

const getGuardianFreePlayers = async (req, res) => {
  try {
    const added_by = req.auth.id;
    const players = await User.find({
      $and: [
        { $or: [{ guardian: null }, { guardian: "undefined" }] },
        { role: "player" },
        { added_by },
      ],
    }).select(["-password", "-token"]);
    res.status(200).json(players);
  } catch (error) {
    console.log(error);
  }
};

const assignPlayerToGuardian = async (req, res) => {
  const player_email = req.body.email;
  const guardianId = req.params.id;
  try {
    if (!player_email) {
      res.status(400).json({
        message: "Player email is missing!",
      });
    } else if (!guardianId) {
      res.status(400).json({
        message: "Guardian ID is missing!",
      });
    } else if (!isValidObjectId(guardianId)) {
      res.status(400).json({
        message: "Invalid Guardian ID",
      });
    } else {
      const guardian = await User.findOne({ _id: guardianId });
      const player = await User.findOne({ email: player_email });
      if (!guardian?._id || !player?._id) {
        res.status(400).json({
          message: "Can't find Guardian or Player!",
        });
      } else {
        const updatePlayer = await User.findOneAndUpdate(
          { _id: player?._id },
          {
            $set: {
              guardian: guardian?._id,
              guardian_name: guardian?.name,
              guardian_email: guardian?.email,
              guardian_phone: guardian?.phone,
            },
          }
        );
        if (updatePlayer) {
          const updateGuardian = await User.findOneAndUpdate(
            { _id: guardian?._id },
            {
              $inc: {
                inactive_player: 1,
                total_player: 1,
              },
            }
          );
          if (updateGuardian) {
            res.status(200).json({
              message: "Player assigned successfully!",
            });
          } else {
            await User.findOneAndUpdate(
              { _id: player?._id },
              {
                $set: {
                  guardian: "",
                  guardian_name: "",
                  guardian_email: "",
                  guardian_phone: "",
                },
              }
            );
            res.status(400).json({
              message: "Cant't update Guardian profile for assign player!",
            });
          }
        } else {
          res.status(400).json({
            message: "Cant't update Player profile for assign player!",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getAllTeamForPlayer = async (req, res) => {
  const playerID = req.params.id;
  try {
    if (!playerID || !isValidObjectId(playerID)) {
      res.status(400).json({
        message: "Invalid Player id!",
      });
    } else {
      const player = await User.findOne({ _id: playerID });
      if (player) {
        // let allTeams = [];
        if (player?.team?.length > 0) {
          // convert ID string to ObjectId...
          // const newId = player?.team?.map((t) => ObjectId(t));
          // const obj = [...newId];

          const allTeams = await Team.find({
            _id: { $in: [...player?.team] },
          });
          res.status(200).json(allTeams);
        } else {
          res.status(200).json({
            message: "Player don't any Team yet!",
          });
        }
      } else {
        res.status(200).json({
          message: "Can't find Player!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getRemainingTeamList = async (req, res) => {
  try {
    const playerId = req.params.id;
    if (!playerId || !isValidObjectId(playerId)) {
      res.status(400).json({
        message: "Invalid Player id!",
      });
    } else {
      const player = await User.findOne({ _id: playerId });
      if (player?._id) {
        if (player?.team?.length > 0 && player?.guardian) {
          const guardian = await User.findOne({ _id: player?.guardian });
          if (guardian?._id) {
            const remainTeams = await Team.find({
              $and: [
                { _id: { $nin: [...player?.team] } },
                { created_by: guardian?.added_by },
              ],
            });
            res.status(200).json(remainTeams);
          } else {
            res.status(400).json({
              message: "Can't find Admin!",
            });
          }
        } else if (player?.team?.length > 0 && player?.added_by) {
          const remainTeams = await Team.find({
            $and: [
              { _id: { $nin: [...player?.team] } },
              { created_by: player?.added_by },
            ],
          });
          res.status(200).json(remainTeams);
        } else {
          const allTeam = await Team.find({ created_by: player?.added_by });
          res.status(200).json(allTeam);
        }
      } else {
        res.status(400).json({
          message: "Can't find Player!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const removePlayerFromTeam = async (req, res) => {
  try {
    const id = req?.params?.id;
    const { player_id } = req.body;

    if (!isValidObjectId(id)) {
      res.status(400).json({
        message: "Invalid Team ID",
      });
    } else if (!isValidObjectId(player_id)) {
      res.status(400).json({
        message: "Invalid Player ID",
      });
    } else {
      const player = await User.findOne({ _id: ObjectId(player_id) });
      if (player?.team?.length > 0 && player?.team?.includes(id)) {
        const updateTeam = await Team.findOneAndUpdate(
          { _id: ObjectId(id) },
          {
            $pull: { player: player?._id },
            $inc: { total_player: -1 },
          }
        );

        if (updateTeam) {
          const updatePlayer = await User.findOneAndUpdate(
            { _id: ObjectId(player_id) },
            {
              $pull: { team: id },
            }
          );
          if (updatePlayer) {
            res.status(200).json({
              message: "Team removed syccessfully.",
            });
          } else {
            res.status(400).json({
              message: "Faild to remove Team. Please try again.",
            });
          }
        } else {
          res.status(400).json({
            message: "Can't update Team. Please try again!",
          });
        }
      } else {
        res.status(400).json({
          message:
            "Faild to find Player or Team information. Please try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addPlayer,
  allPlayer,
  totalPlayer,
  latestPlayer,
  updatePlayer,
  deletePlayer,
  addPlayerForGuardian,
  assignTeam,
  singlePlayer,
  allPlayersForGuardian,
  getGuardianFreePlayers,
  assignPlayerToGuardian,
  getAllTeamForPlayer,
  getRemainingTeamList,
  removePlayerFromTeam,
};
