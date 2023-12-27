const { generateToken } = require("../../../config/generateToken");
const User = require("../../../model/user/userModel");
const Cloudinary = require("../../../config/cloudinary.js");
const sendLoginCredentials = require("../../../config/credentialEmail.js");
const Team = require("../../../model/team/teamModel.js");
const isValidObjectId = require("../../../config/checkValidObjectId.js");
const { ObjectId } = require("mongodb");
const Invoice = require("../../../model/invoice/invoiceModel.js");
const SubInvoice = require("../../../model/invoice/subInvoiceModel.js");
const ChargeDetails = require("../../../model/invoice/chargeDetailsModel.js");
const SubChargeDetails = require("../../../model/invoice/subChargeDetails.js");
const Wallet = require("../../../model/wallet/walletModel.js");
const SystemAuthority = require("../../../model/systemAuthority/systemAuthorityModel.js");
const moment = require("moment");

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
    } else if (!first_name) {
      res.status(400).json({
        message: "Name is required!",
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
        const admin = await User.findOne({
          $and: [{ email: added_by }, { role: "admin" }],
        });
        if (admin?._id) {
          const wallet = await Wallet.findOne({ admin_id: admin?._id });
          const system = await SystemAuthority.findOne({});
          // if (wallet?._id) {
          // } else {
          //   const newWalet = await Wallet.create({
          //     admin_id: admin?._id,
          //     admin_email: admin?.email,
          //     total_charges: "0",
          //     last_payment_date: moment().format(),
          //     created_by: admin?.email,
          //   });
          // }
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
                  const existingInvoice = await Invoice.findOne({
                    $and: [
                      { created_by: admin?.email },
                      { identity_type: "player registration" },
                      { bill_status: "unpaid" },
                    ],
                  });
                  if (existingInvoice?._id) {
                    const subInvoice = await SubInvoice.create({
                      created_by: admin?.email,
                      identity_type: "player registration",
                    });
                    const chargesDetails = await ChargeDetails.create({
                      created_by: admin?.email,
                      identity_type: "player registration",
                    });
                    const subChargesDetails = await SubChargeDetails.create({
                      created_by: admin?.email,
                      identity_type: "player registration",
                    });
                    if (
                      !subInvoice?._id ||
                      !chargesDetails?._id ||
                      !subChargesDetails?._id
                    ) {
                      isValidObjectId(subInvoice?._id) &&
                        (await SubInvoice.findOneAndDelete({
                          _id: subInvoice?._id,
                        }));
                      isValidObjectId(chargesDetails?._id) &&
                        (await ChargeDetails.findOneAndDelete({
                          _id: chargesDetails?._id,
                        }));
                      isValidObjectId(subChargesDetails?._id) &&
                        (await SubChargeDetails.findOneAndDelete({
                          _id: subChargesDetails?._id,
                        }));

                      await User.findOneAndDelete({ _id: newPlayer?._id });
                      res.status(400).json({
                        message: "Can't Create invoices!",
                      });
                    } else {
                      const completeInvoice = await Invoice.findOneAndUpdate(
                        { _id: existingInvoice?._id },
                        {
                          $set: {
                            // billing_from: wallet?.last_payment_date,
                            billing_to: moment().format(),
                            // bill_status: "unpaid",
                            // last_payment_date: wallet?.last_payment_date,
                            // amount:
                            //   parseFloat(existingInvoice?.amount) +
                            //   (system?.core_charge
                            //     ? parseFloat(system?.core_charge)
                            //     : 1),
                          },
                        }
                      );
                      if (completeInvoice) {
                        const completeChargesDetails =
                          await ChargeDetails.findOneAndUpdate(
                            {
                              _id: chargesDetails?._id,
                            },
                            {
                              $set: {
                                invoice_no: existingInvoice?._id,
                                date: moment().format(),
                                total_amount: wallet?.total_charges,
                                chages_type: `Player [${
                                  newPlayer?.name
                                }] registration fees 1 unit charge = ${
                                  system?.core_charge ? system?.core_charge : 1
                                } USD`,
                                guardian_id: newPlayer?.guardian
                                  ? newPlayer?.guardian
                                  : "",
                                player_id: newPlayer?._id,
                                fees: system?.core_charge
                                  ? system?.core_charge
                                  : 1,
                                billing_status: "unpaid",
                                amount: system?.core_charge
                                  ? system?.core_charge
                                  : 1,
                              },
                            }
                          );
                        if (completeChargesDetails) {
                          const completeSubInvoice =
                            await SubInvoice.findOneAndUpdate(
                              { _id: subInvoice?._id },
                              {
                                $set: {
                                  main_invoice_no: existingInvoice?._id,
                                  charges_details: {
                                    id: subChargesDetails?._id,
                                    details: `Player [${
                                      newPlayer?.name
                                    }] registration fees 1 unit charge = ${
                                      system?.core_charge
                                        ? system?.core_charge
                                        : 1
                                    } USD`,
                                  },
                                  billing_from: wallet?.last_payment_date,
                                  billing_to: moment().format(),
                                  last_payment_date: wallet?.last_payment_date,
                                  amount: system?.core_charge
                                    ? system?.core_charge
                                    : 1,
                                },
                              }
                            );
                          if (completeSubInvoice) {
                            const completeSubChargeDetails =
                              await SubChargeDetails.findOneAndUpdate(
                                { _id: subChargesDetails?._id },
                                {
                                  $set: {
                                    main_invoice_no: existingInvoice?._id,
                                    sub_invoice_no: subInvoice?._id,
                                    main_charges_details: chargesDetails?._id,
                                    date: moment().format(),
                                    charge_type: `Player [${
                                      newPlayer?.name
                                    }] registration fees 1 unit charge = ${
                                      system?.core_charge
                                        ? system?.core_charge
                                        : 1
                                    } USD`,
                                    guardian_id: newPlayer?.guardian
                                      ? newPlayer?.guardian
                                      : "",
                                    player_id: newPlayer?._id,
                                    fees: system?.core_charge
                                      ? system?.core_charge
                                      : 1,
                                    billing_status: "unpaid",
                                    amount: system?.core_charge
                                      ? system?.core_charge
                                      : 1,
                                  },
                                }
                              );
                            if (completeSubChargeDetails) {
                              // update the team database model
                              const updateTeam = await Team.findOneAndUpdate(
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
                              if (updateTeam) {
                                const {
                                  password: passwordHashed,
                                  token,
                                  ...sanitizedData
                                } = newPlayer?._doc;
                                sendLoginCredentials(email, password);
                                res.status(200).json(sanitizedData);
                              } else {
                                await User.findOneAndDelete({
                                  _id: newPlayer?._id,
                                });
                                res.status(400).json({
                                  message: "Can't update team!",
                                });
                              }
                            } else {
                              // delete subinvoice
                              SubInvoice.findOneAndDelete({
                                _id: subInvoice?._id,
                              });
                              // delete charges details
                              await ChargeDetails.findOneAndDelete({
                                _id: chargesDetails?._id,
                              });
                              // delete subcharges details
                              await SubChargeDetails.findOneAndDelete({
                                _id: subChargesDetails?._id,
                              });
                              // undo player status unpaid
                              await User.findOneAndDelete({
                                _id: newPlayer?._id,
                              });
                              // send response as unable to create transaction info
                              res.status(400).json({
                                message: "Can't create sub charges details!",
                              });
                            }
                          } else {
                            // delete subinvoice
                            SubInvoice.findOneAndDelete({
                              _id: subInvoice?._id,
                            });
                            // delete charges details
                            await ChargeDetails.findOneAndDelete({
                              _id: chargesDetails?._id,
                            });
                            // delete subcharges details
                            await SubChargeDetails.findOneAndDelete({
                              _id: subChargesDetails?._id,
                            });
                            // undo player status unpaid
                            await User.findOneAndDelete({
                              _id: newPlayer?._id,
                            });
                            // send response as unable to create transaction info
                            res.status(400).json({
                              message: "Can't create sub invoice!",
                            });
                          }
                        } else {
                          // delete subinvoice
                          SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                          // delete charges details
                          await ChargeDetails.findOneAndDelete({
                            _id: chargesDetails?._id,
                          });
                          // delete subcharges details
                          await SubChargeDetails.findOneAndDelete({
                            _id: subChargesDetails?._id,
                          });
                          // undo player status unpaid
                          await User.findOneAndDelete({ _id: newPlayer?._id });
                          // send response as unable to create transaction info
                          res.status(400).json({
                            message: "Can't create charges details!",
                          });
                        }
                      } else {
                        // delete subinvoice
                        SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                        // delete charges details
                        await ChargeDetails.findOneAndDelete({
                          _id: chargesDetails?._id,
                        });
                        // delete subcharges details
                        await SubChargeDetails.findOneAndDelete({
                          _id: subChargesDetails?._id,
                        });
                        // undo player status unpaid
                        await User.findOneAndDelete({ _id: newPlayer?._id });
                        // send response as unable to create transaction info
                        res.status(400).json({
                          message: "Can't create invoice!",
                        });
                      }
                    }
                  } else {
                    const invoice = await Invoice.create({
                      created_by: admin?.email,
                      identity_type: "player registration",
                    });
                    const subInvoice = await SubInvoice.create({
                      created_by: admin?.email,
                      identity_type: "player registration",
                    });
                    const chargesDetails = await ChargeDetails.create({
                      created_by: admin?.email,
                      identity_type: "player registration",
                    });
                    const subChargesDetails = await SubChargeDetails.create({
                      created_by: admin?.email,
                      identity_type: "player registration",
                    });
                    if (
                      !invoice?._id ||
                      !subInvoice?._id ||
                      !chargesDetails?._id ||
                      !subChargesDetails?._id
                    ) {
                      isValidObjectId(invoice?._id) &&
                        (await Invoice.findOneAndDelete({ _id: invoice?._id }));
                      isValidObjectId(subInvoice?._id) &&
                        (await SubInvoice.findOneAndDelete({
                          _id: subInvoice?._id,
                        }));
                      isValidObjectId(chargesDetails?._id) &&
                        (await ChargeDetails.findOneAndDelete({
                          _id: chargesDetails?._id,
                        }));
                      isValidObjectId(subChargesDetails?._id) &&
                        (await SubChargeDetails.findOneAndDelete({
                          _id: subChargesDetails?._id,
                        }));

                      await User.findOneAndDelete({ _id: newPlayer?._id });
                      res.status(400).json({
                        message: "Can't Create invoices!",
                      });
                    } else {
                      const completeInvoice = await Invoice.findOneAndUpdate(
                        { _id: invoice?._id },
                        {
                          $set: {
                            billing_from: wallet?.last_payment_date,
                            billing_to: moment().format(),
                            bill_status: "unpaid",
                            last_payment_date: wallet?.last_payment_date,
                            // amount: system?.core_charge
                            //   ? system?.core_charge
                            //   : 1,
                          },
                        }
                      );
                      if (completeInvoice) {
                        const completeChargesDetails =
                          await ChargeDetails.findOneAndUpdate(
                            {
                              _id: chargesDetails?._id,
                            },
                            {
                              $set: {
                                invoice_no: invoice?._id,
                                date: moment().format(),
                                total_amount: wallet?.total_charges,
                                chages_type: `Player [${
                                  newPlayer?.name
                                }] registration fees 1 unit charge = ${
                                  system?.core_charge ? system?.core_charge : 1
                                } USD`,
                                guardian_id: newPlayer?.guardian
                                  ? newPlayer?.guardian
                                  : "",
                                player_id: newPlayer?._id,
                                fees: system?.core_charge
                                  ? system?.core_charge
                                  : 1,
                                billing_status: "unpaid",
                                amount: system?.core_charge
                                  ? system?.core_charge
                                  : 1,
                              },
                            }
                          );
                        if (completeChargesDetails) {
                          const completeSubInvoice =
                            await SubInvoice.findOneAndUpdate(
                              { _id: subInvoice?._id },
                              {
                                $set: {
                                  main_invoice_no: invoice?._id,
                                  charges_details: {
                                    id: subChargesDetails?._id,
                                    details: `Player [${
                                      newPlayer?.name
                                    }] registration fees 1 unit charge = ${
                                      system?.core_charge
                                        ? system?.core_charge
                                        : 1
                                    } USD`,
                                  },
                                  billing_from: wallet?.last_payment_date,
                                  billing_to: moment().format(),
                                  last_payment_date: wallet?.last_payment_date,
                                  amount: system?.core_charge
                                    ? system?.core_charge
                                    : 1,
                                },
                              }
                            );
                          if (completeSubInvoice) {
                            const completeSubChargeDetails =
                              await SubChargeDetails.findOneAndUpdate(
                                { _id: subChargesDetails?._id },
                                {
                                  $set: {
                                    main_invoice_no: invoice?._id,
                                    sub_invoice_no: subInvoice?._id,
                                    main_charges_details: chargesDetails?._id,
                                    date: moment().format(),
                                    charge_type: `Player [${
                                      newPlayer?.name
                                    }] registration fees 1 unit charge = ${
                                      system?.core_charge
                                        ? system?.core_charge
                                        : 1
                                    } USD`,
                                    guardian_id: newPlayer?.guardian
                                      ? newPlayer?.guardian
                                      : "",
                                    player_id: newPlayer?._id,
                                    fees: system?.core_charge
                                      ? system?.core_charge
                                      : 1,
                                    billing_status: "unpaid",
                                    amount: system?.core_charge
                                      ? system?.core_charge
                                      : 1,
                                  },
                                }
                              );
                            if (completeSubChargeDetails) {
                              // update the team database model
                              const updateTeam = await Team.findOneAndUpdate(
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
                              if (updateTeam) {
                                const {
                                  password: passwordHashed,
                                  token,
                                  ...sanitizedData
                                } = newPlayer?._doc;
                                sendLoginCredentials(email, password);
                                res.status(200).json(sanitizedData);
                              } else {
                                await User.findOneAndDelete({
                                  _id: newPlayer?._id,
                                });
                                res.status(400).json({
                                  message: "Can't update team!",
                                });
                              }
                            } else {
                              // delete invoice
                              Invoice.findOneAndDelete({ _id: invoice?._id });
                              // delete subinvoice
                              SubInvoice.findOneAndDelete({
                                _id: subInvoice?._id,
                              });
                              // delete charges details
                              await ChargeDetails.findOneAndDelete({
                                _id: chargesDetails?._id,
                              });
                              // delete subcharges details
                              await SubChargeDetails.findOneAndDelete({
                                _id: subChargesDetails?._id,
                              });
                              // undo player status unpaid
                              await User.findOneAndDelete({
                                _id: newPlayer?._id,
                              });
                              // send response as unable to create transaction info
                              res.status(400).json({
                                message: "Can't create sub charges details!",
                              });
                            }
                          } else {
                            // delete invoice
                            Invoice.findOneAndDelete({ _id: invoice?._id });
                            // delete subinvoice
                            SubInvoice.findOneAndDelete({
                              _id: subInvoice?._id,
                            });
                            // delete charges details
                            await ChargeDetails.findOneAndDelete({
                              _id: chargesDetails?._id,
                            });
                            // delete subcharges details
                            await SubChargeDetails.findOneAndDelete({
                              _id: subChargesDetails?._id,
                            });
                            // undo player status unpaid
                            await User.findOneAndDelete({
                              _id: newPlayer?._id,
                            });
                            // send response as unable to create transaction info
                            res.status(400).json({
                              message: "Can't create sub invoice!",
                            });
                          }
                        } else {
                          // delete invoice
                          Invoice.findOneAndDelete({ _id: invoice?._id });
                          // delete subinvoice
                          SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                          // delete charges details
                          await ChargeDetails.findOneAndDelete({
                            _id: chargesDetails?._id,
                          });
                          // delete subcharges details
                          await SubChargeDetails.findOneAndDelete({
                            _id: subChargesDetails?._id,
                          });
                          // undo player status unpaid
                          await User.findOneAndDelete({ _id: newPlayer?._id });
                          // send response as unable to create transaction info
                          res.status(400).json({
                            message: "Can't create charges details!",
                          });
                        }
                      } else {
                        // delete invoice
                        Invoice.findOneAndDelete({ _id: invoice?._id });
                        // delete subinvoice
                        SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                        // delete charges details
                        await ChargeDetails.findOneAndDelete({
                          _id: chargesDetails?._id,
                        });
                        // delete subcharges details
                        await SubChargeDetails.findOneAndDelete({
                          _id: subChargesDetails?._id,
                        });
                        // undo player status unpaid
                        await User.findOneAndDelete({ _id: newPlayer?._id });
                        // send response as unable to create transaction info
                        res.status(400).json({
                          message: "Can't create invoice!",
                        });
                      }
                    }
                  }
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
                const existingInvoice = await Invoice.findOne({
                  $and: [
                    { created_by: admin?.email },
                    { identity_type: "player registration" },
                    { bill_status: "unpaid" },
                  ],
                });
                if (existingInvoice?._id) {
                  const subInvoice = await SubInvoice.create({
                    created_by: admin?.email,
                    identity_type: "player registration",
                  });
                  const chargesDetails = await ChargeDetails.create({
                    created_by: admin?.email,
                    identity_type: "player registration",
                  });
                  const subChargesDetails = await SubChargeDetails.create({
                    created_by: admin?.email,
                    identity_type: "player registration",
                  });
                  if (
                    !subInvoice?._id ||
                    !chargesDetails?._id ||
                    !subChargesDetails?._id
                  ) {
                    isValidObjectId(subInvoice?._id) &&
                      (await SubInvoice.findOneAndDelete({
                        _id: subInvoice?._id,
                      }));
                    isValidObjectId(chargesDetails?._id) &&
                      (await ChargeDetails.findOneAndDelete({
                        _id: chargesDetails?._id,
                      }));
                    isValidObjectId(subChargesDetails?._id) &&
                      (await SubChargeDetails.findOneAndDelete({
                        _id: subChargesDetails?._id,
                      }));

                    await User.findOneAndDelete({ _id: newPlayer?._id });
                    res.status(400).json({
                      message: "Can't Create invoices!",
                    });
                  } else {
                    const completeInvoice = await Invoice.findOneAndUpdate(
                      { _id: existingInvoice?._id },
                      {
                        $set: {
                          billing_from: wallet?.last_payment_date,
                          billing_to: moment().format(),
                          bill_status: "unpaid",
                          last_payment_date: wallet?.last_payment_date,
                          // amount:
                          //   parseFloat(existingInvoice?.amount) +
                          //   (system?.core_charge
                          //     ? parseFloat(system?.core_charge)
                          //     : 1),
                        },
                      }
                    );
                    if (completeInvoice) {
                      const completeChargesDetails =
                        await ChargeDetails.findOneAndUpdate(
                          {
                            _id: chargesDetails?._id,
                          },
                          {
                            $set: {
                              invoice_no: existingInvoice?._id,
                              date: moment().format(),
                              total_amount: wallet?.total_charges,
                              chages_type: `Player [${
                                newPlayer?.name
                              }] registration fees 1 unit charge = ${
                                system?.core_charge ? system?.core_charge : 1
                              } USD`,
                              guardian_id: newPlayer?.guardian
                                ? newPlayer?.guardian
                                : "",
                              player_id: newPlayer?._id,
                              fees: system?.core_charge
                                ? system?.core_charge
                                : 1,
                              billing_status: "unpaid",
                              amount: system?.core_charge
                                ? system?.core_charge
                                : 1,
                            },
                          }
                        );
                      if (completeChargesDetails) {
                        const completeSubInvoice =
                          await SubInvoice.findOneAndUpdate(
                            { _id: subInvoice?._id },
                            {
                              $set: {
                                main_invoice_no: existingInvoice?._id,
                                charges_details: {
                                  id: subChargesDetails?._id,
                                  details: `Player [${
                                    newPlayer?.name
                                  }] registration fees 1 unit charge = ${
                                    system?.core_charge
                                      ? system?.core_charge
                                      : 1
                                  } USD`,
                                },
                                billing_from: wallet?.last_payment_date,
                                billing_to: moment().format(),
                                last_payment_date: wallet?.last_payment_date,
                                amount: system?.core_charge
                                  ? system?.core_charge
                                  : 1,
                              },
                            }
                          );
                        if (completeSubInvoice) {
                          const completeSubChargeDetails =
                            await SubChargeDetails.findOneAndUpdate(
                              { _id: subChargesDetails?._id },
                              {
                                $set: {
                                  main_invoice_no: existingInvoice?._id,
                                  sub_invoice_no: subInvoice?._id,
                                  main_charges_details: chargesDetails?._id,
                                  date: moment().format(),
                                  charge_type: `Player [${
                                    newPlayer?.name
                                  }] registration fees 1 unit charge = ${
                                    system?.core_charge
                                      ? system?.core_charge
                                      : 1
                                  } USD`,
                                  guardian_id: newPlayer?.guardian
                                    ? newPlayer?.guardian
                                    : "",
                                  player_id: newPlayer?._id,
                                  fees: system?.core_charge
                                    ? system?.core_charge
                                    : 1,
                                  billing_status: "unpaid",
                                  amount: system?.core_charge
                                    ? system?.core_charge
                                    : 1,
                                },
                              }
                            );
                          if (completeSubChargeDetails) {
                            sendLoginCredentials(email, password);
                            const {
                              password: passwordHashed,
                              token,
                              ...sanitizedData
                            } = newPlayer?._doc;
                            res.status(200).json(sanitizedData);
                          } else {
                            // delete subinvoice
                            SubInvoice.findOneAndDelete({
                              _id: subInvoice?._id,
                            });
                            // delete charges details
                            await ChargeDetails.findOneAndDelete({
                              _id: chargesDetails?._id,
                            });
                            // delete subcharges details
                            await SubChargeDetails.findOneAndDelete({
                              _id: subChargesDetails?._id,
                            });
                            // undo player status unpaid
                            await User.findOneAndDelete({
                              _id: newPlayer?._id,
                            });
                            // send response as unable to create transaction info
                            res.status(400).json({
                              message: "Can't create sub charges details!",
                            });
                          }
                        } else {
                          // delete subinvoice
                          SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                          // delete charges details
                          await ChargeDetails.findOneAndDelete({
                            _id: chargesDetails?._id,
                          });
                          // delete subcharges details
                          await SubChargeDetails.findOneAndDelete({
                            _id: subChargesDetails?._id,
                          });
                          // undo player status unpaid
                          await User.findOneAndDelete({ _id: newPlayer?._id });
                          // send response as unable to create transaction info
                          res.status(400).json({
                            message: "Can't create sub invoice!",
                          });
                        }
                      } else {
                        // delete subinvoice
                        SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                        // delete charges details
                        await ChargeDetails.findOneAndDelete({
                          _id: chargesDetails?._id,
                        });
                        // delete subcharges details
                        await SubChargeDetails.findOneAndDelete({
                          _id: subChargesDetails?._id,
                        });
                        // undo player status unpaid
                        await User.findOneAndDelete({ _id: newPlayer?._id });
                        // send response as unable to create transaction info
                        res.status(400).json({
                          message: "Can't create charges details!",
                        });
                      }
                    } else {
                      // delete subinvoice
                      SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                      // delete charges details
                      await ChargeDetails.findOneAndDelete({
                        _id: chargesDetails?._id,
                      });
                      // delete subcharges details
                      await SubChargeDetails.findOneAndDelete({
                        _id: subChargesDetails?._id,
                      });
                      // undo player status unpaid
                      await User.findOneAndDelete({ _id: newPlayer?._id });
                      // send response as unable to create transaction info
                      res.status(400).json({
                        message: "Can't create invoice!",
                      });
                    }
                  }
                } else {
                  const invoice = await Invoice.create({
                    created_by: admin?.email,
                    identity_type: "player registration",
                  });
                  const subInvoice = await SubInvoice.create({
                    created_by: admin?.email,
                    identity_type: "player registration",
                  });
                  const chargesDetails = await ChargeDetails.create({
                    created_by: admin?.email,
                    identity_type: "player registration",
                  });
                  const subChargesDetails = await SubChargeDetails.create({
                    created_by: admin?.email,
                    identity_type: "player registration",
                  });
                  if (
                    !invoice?._id ||
                    !subInvoice?._id ||
                    !chargesDetails?._id ||
                    !subChargesDetails?._id
                  ) {
                    isValidObjectId(invoice?._id) &&
                      (await Invoice.findOneAndDelete({ _id: invoice?._id }));
                    isValidObjectId(subInvoice?._id) &&
                      (await SubInvoice.findOneAndDelete({
                        _id: subInvoice?._id,
                      }));
                    isValidObjectId(chargesDetails?._id) &&
                      (await ChargeDetails.findOneAndDelete({
                        _id: chargesDetails?._id,
                      }));
                    isValidObjectId(subChargesDetails?._id) &&
                      (await SubChargeDetails.findOneAndDelete({
                        _id: subChargesDetails?._id,
                      }));

                    await User.findOneAndDelete({ _id: newPlayer?._id });
                    res.status(400).json({
                      message: "Can't Create invoices!",
                    });
                  } else {
                    const completeInvoice = await Invoice.findOneAndUpdate(
                      { _id: invoice?._id },
                      {
                        $set: {
                          billing_from: wallet?.last_payment_date,
                          billing_to: moment().format(),
                          bill_status: "unpaid",
                          last_payment_date: wallet?.last_payment_date,
                          // amount: system?.core_charge ? system?.core_charge : 1,
                        },
                      }
                    );
                    if (completeInvoice) {
                      const completeChargesDetails =
                        await ChargeDetails.findOneAndUpdate(
                          {
                            _id: chargesDetails?._id,
                          },
                          {
                            $set: {
                              invoice_no: invoice?._id,
                              date: moment().format(),
                              total_amount: wallet?.total_charges,
                              chages_type: `Player [${
                                newPlayer?.name
                              }] registration fees 1 unit charge = ${
                                system?.core_charge ? system?.core_charge : 1
                              } USD`,
                              guardian_id: newPlayer?.guardian
                                ? newPlayer?.guardian
                                : "",
                              player_id: newPlayer?._id,
                              fees: system?.core_charge
                                ? system?.core_charge
                                : 1,
                              billing_status: "unpaid",
                              amount: system?.core_charge
                                ? system?.core_charge
                                : 1,
                            },
                          }
                        );
                      if (completeChargesDetails) {
                        const completeSubInvoice =
                          await SubInvoice.findOneAndUpdate(
                            { _id: subInvoice?._id },
                            {
                              $set: {
                                main_invoice_no: invoice?._id,
                                charges_details: {
                                  id: subChargesDetails?._id,
                                  details: `Player [${
                                    newPlayer?.name
                                  }] registration fees 1 unit charge = ${
                                    system?.core_charge
                                      ? system?.core_charge
                                      : 1
                                  } USD`,
                                },
                                billing_from: wallet?.last_payment_date,
                                billing_to: moment().format(),
                                last_payment_date: wallet?.last_payment_date,
                                amount: system?.core_charge
                                  ? system?.core_charge
                                  : 1,
                              },
                            }
                          );
                        if (completeSubInvoice) {
                          const completeSubChargeDetails =
                            await SubChargeDetails.findOneAndUpdate(
                              { _id: subChargesDetails?._id },
                              {
                                $set: {
                                  main_invoice_no: invoice?._id,
                                  sub_invoice_no: subInvoice?._id,
                                  main_charges_details: chargesDetails?._id,
                                  date: moment().format(),
                                  charge_type: `Player [${
                                    newPlayer?.name
                                  }] registration fees 1 unit charge = ${
                                    system?.core_charge
                                      ? system?.core_charge
                                      : 1
                                  } USD`,
                                  guardian_id: newPlayer?.guardian
                                    ? newPlayer?.guardian
                                    : "",
                                  player_id: newPlayer?._id,
                                  fees: system?.core_charge
                                    ? system?.core_charge
                                    : 1,
                                  billing_status: "unpaid",
                                  amount: system?.core_charge
                                    ? system?.core_charge
                                    : 1,
                                },
                              }
                            );
                          if (completeSubChargeDetails) {
                            sendLoginCredentials(email, password);
                            const {
                              password: passwordHashed,
                              token,
                              ...sanitizedData
                            } = newPlayer?._doc;
                            res.status(200).json(sanitizedData);
                          } else {
                            // delete invoice
                            Invoice.findOneAndDelete({ _id: invoice?._id });
                            // delete subinvoice
                            SubInvoice.findOneAndDelete({
                              _id: subInvoice?._id,
                            });
                            // delete charges details
                            await ChargeDetails.findOneAndDelete({
                              _id: chargesDetails?._id,
                            });
                            // delete subcharges details
                            await SubChargeDetails.findOneAndDelete({
                              _id: subChargesDetails?._id,
                            });
                            // undo player status unpaid
                            await User.findOneAndDelete({
                              _id: newPlayer?._id,
                            });
                            // send response as unable to create transaction info
                            res.status(400).json({
                              message: "Can't create sub charges details!",
                            });
                          }
                        } else {
                          // delete invoice
                          Invoice.findOneAndDelete({ _id: invoice?._id });
                          // delete subinvoice
                          SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                          // delete charges details
                          await ChargeDetails.findOneAndDelete({
                            _id: chargesDetails?._id,
                          });
                          // delete subcharges details
                          await SubChargeDetails.findOneAndDelete({
                            _id: subChargesDetails?._id,
                          });
                          // undo player status unpaid
                          await User.findOneAndDelete({ _id: newPlayer?._id });
                          // send response as unable to create transaction info
                          res.status(400).json({
                            message: "Can't create sub invoice!",
                          });
                        }
                      } else {
                        // delete invoice
                        Invoice.findOneAndDelete({ _id: invoice?._id });
                        // delete subinvoice
                        SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                        // delete charges details
                        await ChargeDetails.findOneAndDelete({
                          _id: chargesDetails?._id,
                        });
                        // delete subcharges details
                        await SubChargeDetails.findOneAndDelete({
                          _id: subChargesDetails?._id,
                        });
                        // undo player status unpaid
                        await User.findOneAndDelete({ _id: newPlayer?._id });
                        // send response as unable to create transaction info
                        res.status(400).json({
                          message: "Can't create charges details!",
                        });
                      }
                    } else {
                      // delete invoice
                      Invoice.findOneAndDelete({ _id: invoice?._id });
                      // delete subinvoice
                      SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                      // delete charges details
                      await ChargeDetails.findOneAndDelete({
                        _id: chargesDetails?._id,
                      });
                      // delete subcharges details
                      await SubChargeDetails.findOneAndDelete({
                        _id: subChargesDetails?._id,
                      });
                      // undo player status unpaid
                      await User.findOneAndDelete({ _id: newPlayer?._id });
                      // send response as unable to create transaction info
                      res.status(400).json({
                        message: "Can't create invoice!",
                      });
                    }
                  }
                }
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
          res.status(400).json({
            message: "Can't find admin!",
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
          const admin = await User.findOne({
            $and: [{ email: guardian?.added_by }, { role: "admin" }],
          });
          if (admin?._id) {
            const wallet = await Wallet.findOne({ admin_id: admin?._id });
            const system = await SystemAuthority.findOne({});
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
                  const existingInvoice = await Invoice.findOne({
                    $and: [
                      { created_by: admin?.email },
                      { identity_type: "player registration" },
                      { bill_status: "unpaid" },
                    ],
                  });
                  if (existingInvoice?._id) {
                    const subInvoice = await SubInvoice.create({
                      created_by: admin?.email,
                      identity_type: "player registration",
                    });
                    const chargesDetails = await ChargeDetails.create({
                      created_by: admin?.email,
                      identity_type: "player registration",
                    });
                    const subChargesDetails = await SubChargeDetails.create({
                      created_by: admin?.email,
                      identity_type: "player registration",
                    });
                    if (
                      !subInvoice?._id ||
                      !chargesDetails?._id ||
                      !subChargesDetails?._id
                    ) {
                      isValidObjectId(subInvoice?._id) &&
                        (await SubInvoice.findOneAndDelete({
                          _id: subInvoice?._id,
                        }));
                      isValidObjectId(chargesDetails?._id) &&
                        (await ChargeDetails.findOneAndDelete({
                          _id: chargesDetails?._id,
                        }));
                      isValidObjectId(subChargesDetails?._id) &&
                        (await SubChargeDetails.findOneAndDelete({
                          _id: subChargesDetails?._id,
                        }));

                      await User.findOneAndDelete({ _id: newPlayer?._id });
                      res.status(400).json({
                        message: "Can't Create invoices!",
                      });
                    } else {
                      const completeInvoice = await Invoice.findOneAndUpdate(
                        { _id: existingInvoice?._id },
                        {
                          $set: {
                            billing_from: wallet?.last_payment_date,
                            billing_to: moment().format(),
                            bill_status: "unpaid",
                            last_payment_date: wallet?.last_payment_date,
                            // amount:
                            //   parseFloat(existingInvoice?.amount) +
                            //   (system?.core_charge
                            //     ? parseFloat(system?.core_charge)
                            //     : 1),
                          },
                        }
                      );
                      if (completeInvoice) {
                        const completeChargesDetails =
                          await ChargeDetails.findOneAndUpdate(
                            {
                              _id: chargesDetails?._id,
                            },
                            {
                              $set: {
                                invoice_no: existingInvoice?._id,
                                date: moment().format(),
                                total_amount: wallet?.total_charges,
                                chages_type: `Player [${
                                  newPlayer?.name
                                }] registration fees 1 unit charge = ${
                                  system?.core_charge ? system?.core_charge : 1
                                } USD`,
                                guardian_id: newPlayer?.guardian
                                  ? newPlayer?.guardian
                                  : "",
                                player_id: newPlayer?._id,
                                fees: system?.core_charge
                                  ? system?.core_charge
                                  : 1,
                                billing_status: "unpaid",
                                amount: system?.core_charge
                                  ? system?.core_charge
                                  : 1,
                              },
                            }
                          );
                        if (completeChargesDetails) {
                          const completeSubInvoice =
                            await SubInvoice.findOneAndUpdate(
                              { _id: subInvoice?._id },
                              {
                                $set: {
                                  main_invoice_no: existingInvoice?._id,
                                  charges_details: {
                                    id: subChargesDetails?._id,
                                    details: `Player [${
                                      newPlayer?.name
                                    }] registration fees 1 unit charge = ${
                                      system?.core_charge
                                        ? system?.core_charge
                                        : 1
                                    } USD`,
                                  },
                                  billing_from: wallet?.last_payment_date,
                                  billing_to: moment().format(),
                                  last_payment_date: wallet?.last_payment_date,
                                  amount: system?.core_charge
                                    ? system?.core_charge
                                    : 1,
                                },
                              }
                            );
                          if (completeSubInvoice) {
                            const completeSubChargeDetails =
                              await SubChargeDetails.findOneAndUpdate(
                                { _id: subChargesDetails?._id },
                                {
                                  $set: {
                                    main_invoice_no: existingInvoice?._id,
                                    sub_invoice_no: subInvoice?._id,
                                    main_charges_details: chargesDetails?._id,
                                    date: moment().format(),
                                    charge_type: `Player [${
                                      newPlayer?.name
                                    }] registration fees 1 unit charge = ${
                                      system?.core_charge
                                        ? system?.core_charge
                                        : 1
                                    } USD`,
                                    guardian_id: newPlayer?.guardian
                                      ? newPlayer?.guardian
                                      : "",
                                    player_id: newPlayer?._id,
                                    fees: system?.core_charge
                                      ? system?.core_charge
                                      : 1,
                                    billing_status: "unpaid",
                                    amount: system?.core_charge
                                      ? system?.core_charge
                                      : 1,
                                  },
                                }
                              );
                            if (completeSubChargeDetails) {
                              // update the Guardian's active/inactive players in database model
                              const updateGuardian =
                                await User.findOneAndUpdate(
                                  { _id: guardian_id },
                                  {
                                    $inc: {
                                      inactive_player: 1,
                                      total_player: 1,
                                    },
                                  }
                                );
                              if (updateGuardian) {
                                // update the team database model
                                const updateTeam = await Team.findOneAndUpdate(
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
                                if (updateTeam) {
                                  const {
                                    password: passwordHashed,
                                    token,
                                    ...sanitizedData
                                  } = newPlayer?._doc;
                                  sendLoginCredentials(email, password);
                                  res.status(200).json(sanitizedData);
                                } else {
                                  await User.findOneAndUpdate(
                                    { _id: guardian_id },
                                    {
                                      $inc: {
                                        inactive_player: -1,
                                        total_player: -1,
                                      },
                                    }
                                  );
                                  await User.findOneAndDelete({
                                    _id: newPlayer?._id,
                                  });
                                  res.status(400).json({
                                    message: "Can't update team!",
                                  });
                                }
                              } else {
                                await User.findOneAndDelete({
                                  _id: newPlayer?._id,
                                });
                                res.status(400).json({
                                  message: "Can't update guardian!",
                                });
                              }
                            } else {
                              // delete subinvoice
                              SubInvoice.findOneAndDelete({
                                _id: subInvoice?._id,
                              });
                              // delete charges details
                              await ChargeDetails.findOneAndDelete({
                                _id: chargesDetails?._id,
                              });
                              // delete subcharges details
                              await SubChargeDetails.findOneAndDelete({
                                _id: subChargesDetails?._id,
                              });
                              // undo player status unpaid
                              await User.findOneAndDelete({
                                _id: newPlayer?._id,
                              });
                              // send response as unable to create transaction info
                              res.status(400).json({
                                message: "Can't create sub charges details!",
                              });
                            }
                          } else {
                            // delete subinvoice
                            SubInvoice.findOneAndDelete({
                              _id: subInvoice?._id,
                            });
                            // delete charges details
                            await ChargeDetails.findOneAndDelete({
                              _id: chargesDetails?._id,
                            });
                            // delete subcharges details
                            await SubChargeDetails.findOneAndDelete({
                              _id: subChargesDetails?._id,
                            });
                            // undo player status unpaid
                            await User.findOneAndDelete({
                              _id: newPlayer?._id,
                            });
                            // send response as unable to create transaction info
                            res.status(400).json({
                              message: "Can't create sub invoice!",
                            });
                          }
                        } else {
                          // delete subinvoice
                          SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                          // delete charges details
                          await ChargeDetails.findOneAndDelete({
                            _id: chargesDetails?._id,
                          });
                          // delete subcharges details
                          await SubChargeDetails.findOneAndDelete({
                            _id: subChargesDetails?._id,
                          });
                          // undo player status unpaid
                          await User.findOneAndDelete({ _id: newPlayer?._id });
                          // send response as unable to create transaction info
                          res.status(400).json({
                            message: "Can't create charges details!",
                          });
                        }
                      } else {
                        // delete subinvoice
                        SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                        // delete charges details
                        await ChargeDetails.findOneAndDelete({
                          _id: chargesDetails?._id,
                        });
                        // delete subcharges details
                        await SubChargeDetails.findOneAndDelete({
                          _id: subChargesDetails?._id,
                        });
                        // undo player status unpaid
                        await User.findOneAndDelete({ _id: newPlayer?._id });
                        // send response as unable to create transaction info
                        res.status(400).json({
                          message: "Can't create invoice!",
                        });
                      }
                    }
                  } else {
                    const invoice = await Invoice.create({
                      created_by: admin?.email,
                      identity_type: "player registration",
                    });
                    const subInvoice = await SubInvoice.create({
                      created_by: admin?.email,
                      identity_type: "player registration",
                    });
                    const chargesDetails = await ChargeDetails.create({
                      created_by: admin?.email,
                      identity_type: "player registration",
                    });
                    const subChargesDetails = await SubChargeDetails.create({
                      created_by: admin?.email,
                      identity_type: "player registration",
                    });
                    if (
                      !invoice?._id ||
                      !subInvoice?._id ||
                      !chargesDetails?._id ||
                      !subChargesDetails?._id
                    ) {
                      isValidObjectId(invoice?._id) &&
                        (await Invoice.findOneAndDelete({ _id: invoice?._id }));
                      isValidObjectId(subInvoice?._id) &&
                        (await SubInvoice.findOneAndDelete({
                          _id: subInvoice?._id,
                        }));
                      isValidObjectId(chargesDetails?._id) &&
                        (await ChargeDetails.findOneAndDelete({
                          _id: chargesDetails?._id,
                        }));
                      isValidObjectId(subChargesDetails?._id) &&
                        (await SubChargeDetails.findOneAndDelete({
                          _id: subChargesDetails?._id,
                        }));

                      await User.findOneAndDelete({ _id: newPlayer?._id });
                      res.status(400).json({
                        message: "Can't Create invoices!",
                      });
                    } else {
                      const completeInvoice = await Invoice.findOneAndUpdate(
                        { _id: invoice?._id },
                        {
                          $set: {
                            billing_from: wallet?.last_payment_date,
                            billing_to: moment().format(),
                            bill_status: "unpaid",
                            last_payment_date: wallet?.last_payment_date,
                            // amount: system?.core_charge
                            //   ? system?.core_charge
                            //   : 1,
                          },
                        }
                      );
                      if (completeInvoice) {
                        const completeChargesDetails =
                          await ChargeDetails.findOneAndUpdate(
                            {
                              _id: chargesDetails?._id,
                            },
                            {
                              $set: {
                                invoice_no: invoice?._id,
                                date: moment().format(),
                                total_amount: wallet?.total_charges,
                                chages_type: `Player [${
                                  newPlayer?.name
                                }] registration fees 1 unit charge = ${
                                  system?.core_charge ? system?.core_charge : 1
                                } USD`,
                                guardian_id: newPlayer?.guardian
                                  ? newPlayer?.guardian
                                  : "",
                                player_id: newPlayer?._id,
                                fees: system?.core_charge
                                  ? system?.core_charge
                                  : 1,
                                billing_status: "unpaid",
                                amount: system?.core_charge
                                  ? system?.core_charge
                                  : 1,
                              },
                            }
                          );
                        if (completeChargesDetails) {
                          const completeSubInvoice =
                            await SubInvoice.findOneAndUpdate(
                              { _id: subInvoice?._id },
                              {
                                $set: {
                                  main_invoice_no: invoice?._id,
                                  charges_details: {
                                    id: subChargesDetails?._id,
                                    details: `Player [${
                                      newPlayer?.name
                                    }] registration fees 1 unit charge = ${
                                      system?.core_charge
                                        ? system?.core_charge
                                        : 1
                                    } USD`,
                                  },
                                  billing_from: wallet?.last_payment_date,
                                  billing_to: moment().format(),
                                  last_payment_date: wallet?.last_payment_date,
                                  amount: system?.core_charge
                                    ? system?.core_charge
                                    : 1,
                                },
                              }
                            );
                          if (completeSubInvoice) {
                            const completeSubChargeDetails =
                              await SubChargeDetails.findOneAndUpdate(
                                { _id: subChargesDetails?._id },
                                {
                                  $set: {
                                    main_invoice_no: invoice?._id,
                                    sub_invoice_no: subInvoice?._id,
                                    main_charges_details: chargesDetails?._id,
                                    date: moment().format(),
                                    charge_type: `Player [${
                                      newPlayer?.name
                                    }] registration fees 1 unit charge = ${
                                      system?.core_charge
                                        ? system?.core_charge
                                        : 1
                                    } USD`,
                                    guardian_id: newPlayer?.guardian
                                      ? newPlayer?.guardian
                                      : "",
                                    player_id: newPlayer?._id,
                                    fees: system?.core_charge
                                      ? system?.core_charge
                                      : 1,
                                    billing_status: "unpaid",
                                    amount: system?.core_charge
                                      ? system?.core_charge
                                      : 1,
                                  },
                                }
                              );
                            if (completeSubChargeDetails) {
                              // update the Guardian's active/inactive players in database model
                              const updateGuardian =
                                await User.findOneAndUpdate(
                                  { _id: guardian_id },
                                  {
                                    $inc: {
                                      inactive_player: 1,
                                      total_player: 1,
                                    },
                                  }
                                );
                              if (updateGuardian) {
                                // update the team database model
                                const updateTeam = await Team.findOneAndUpdate(
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
                                if (updateTeam) {
                                  const {
                                    password: passwordHashed,
                                    token,
                                    ...sanitizedData
                                  } = newPlayer?._doc;
                                  sendLoginCredentials(email, password);
                                  res.status(200).json(sanitizedData);
                                } else {
                                  await User.findOneAndUpdate(
                                    { _id: guardian_id },
                                    {
                                      $inc: {
                                        inactive_player: -1,
                                        total_player: -1,
                                      },
                                    }
                                  );
                                  await User.findOneAndDelete({
                                    _id: newPlayer?._id,
                                  });
                                  res.status(400).json({
                                    message: "Can't update team!",
                                  });
                                }
                              } else {
                                await User.findOneAndDelete({
                                  _id: newPlayer?._id,
                                });
                                res.status(400).json({
                                  message: "Can't update guardian!",
                                });
                              }
                            } else {
                              // delete invoice
                              Invoice.findOneAndDelete({ _id: invoice?._id });
                              // delete subinvoice
                              SubInvoice.findOneAndDelete({
                                _id: subInvoice?._id,
                              });
                              // delete charges details
                              await ChargeDetails.findOneAndDelete({
                                _id: chargesDetails?._id,
                              });
                              // delete subcharges details
                              await SubChargeDetails.findOneAndDelete({
                                _id: subChargesDetails?._id,
                              });
                              // undo player status unpaid
                              await User.findOneAndDelete({
                                _id: newPlayer?._id,
                              });
                              // send response as unable to create transaction info
                              res.status(400).json({
                                message: "Can't create sub charges details!",
                              });
                            }
                          } else {
                            // delete invoice
                            Invoice.findOneAndDelete({ _id: invoice?._id });
                            // delete subinvoice
                            SubInvoice.findOneAndDelete({
                              _id: subInvoice?._id,
                            });
                            // delete charges details
                            await ChargeDetails.findOneAndDelete({
                              _id: chargesDetails?._id,
                            });
                            // delete subcharges details
                            await SubChargeDetails.findOneAndDelete({
                              _id: subChargesDetails?._id,
                            });
                            // undo player status unpaid
                            await User.findOneAndDelete({
                              _id: newPlayer?._id,
                            });
                            // send response as unable to create transaction info
                            res.status(400).json({
                              message: "Can't create sub invoice!",
                            });
                          }
                        } else {
                          // delete invoice
                          Invoice.findOneAndDelete({ _id: invoice?._id });
                          // delete subinvoice
                          SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                          // delete charges details
                          await ChargeDetails.findOneAndDelete({
                            _id: chargesDetails?._id,
                          });
                          // delete subcharges details
                          await SubChargeDetails.findOneAndDelete({
                            _id: subChargesDetails?._id,
                          });
                          // undo player status unpaid
                          await User.findOneAndDelete({ _id: newPlayer?._id });
                          // send response as unable to create transaction info
                          res.status(400).json({
                            message: "Can't create charges details!",
                          });
                        }
                      } else {
                        // delete invoice
                        Invoice.findOneAndDelete({ _id: invoice?._id });
                        // delete subinvoice
                        SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                        // delete charges details
                        await ChargeDetails.findOneAndDelete({
                          _id: chargesDetails?._id,
                        });
                        // delete subcharges details
                        await SubChargeDetails.findOneAndDelete({
                          _id: subChargesDetails?._id,
                        });
                        // undo player status unpaid
                        await User.findOneAndDelete({ _id: newPlayer?._id });
                        // send response as unable to create transaction info
                        res.status(400).json({
                          message: "Can't create invoice!",
                        });
                      }
                    }
                  }
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
                const existingInvoice = await Invoice.findOne({
                  $and: [
                    { created_by: admin?.email },
                    { identity_type: "player registration" },
                    { bill_status: "unpaid" },
                  ],
                });
                if (existingInvoice?._id) {
                  const subInvoice = await SubInvoice.create({
                    created_by: admin?.email,
                    identity_type: "player registration",
                  });
                  const chargesDetails = await ChargeDetails.create({
                    created_by: admin?.email,
                    identity_type: "player registration",
                  });
                  const subChargesDetails = await SubChargeDetails.create({
                    created_by: admin?.email,
                    identity_type: "player registration",
                  });
                  if (
                    !subInvoice?._id ||
                    !chargesDetails?._id ||
                    !subChargesDetails?._id
                  ) {
                    isValidObjectId(subInvoice?._id) &&
                      (await SubInvoice.findOneAndDelete({
                        _id: subInvoice?._id,
                      }));
                    isValidObjectId(chargesDetails?._id) &&
                      (await ChargeDetails.findOneAndDelete({
                        _id: chargesDetails?._id,
                      }));
                    isValidObjectId(subChargesDetails?._id) &&
                      (await SubChargeDetails.findOneAndDelete({
                        _id: subChargesDetails?._id,
                      }));

                    await User.findOneAndDelete({ _id: newPlayer?._id });
                    res.status(400).json({
                      message: "Can't Create invoices!",
                    });
                  } else {
                    const completeInvoice = await Invoice.findOneAndUpdate(
                      { _id: existingInvoice?._id },
                      {
                        $set: {
                          billing_from: wallet?.last_payment_date,
                          billing_to: moment().format(),
                          bill_status: "unpaid",
                          last_payment_date: wallet?.last_payment_date,
                          // amount:
                          //   parseFloat(existingInvoice?.amount) +
                          //   (system?.core_charge
                          //     ? parseFloat(system?.core_charge)
                          //     : 1),
                        },
                      }
                    );
                    if (completeInvoice) {
                      const completeChargesDetails =
                        await ChargeDetails.findOneAndUpdate(
                          {
                            _id: chargesDetails?._id,
                          },
                          {
                            $set: {
                              invoice_no: existingInvoice?._id,
                              date: moment().format(),
                              total_amount: wallet?.total_charges,
                              chages_type: `Player [${
                                newPlayer?.name
                              }] registration fees 1 unit charge = ${
                                system?.core_charge ? system?.core_charge : 1
                              } USD`,
                              guardian_id: newPlayer?.guardian
                                ? newPlayer?.guardian
                                : "",
                              player_id: newPlayer?._id,
                              fees: system?.core_charge
                                ? system?.core_charge
                                : 1,
                              billing_status: "unpaid",
                              amount: system?.core_charge
                                ? system?.core_charge
                                : 1,
                            },
                          }
                        );
                      if (completeChargesDetails) {
                        const completeSubInvoice =
                          await SubInvoice.findOneAndUpdate(
                            { _id: subInvoice?._id },
                            {
                              $set: {
                                main_invoice_no: existingInvoice?._id,
                                charges_details: {
                                  id: subChargesDetails?._id,
                                  details: `Player [${
                                    newPlayer?.name
                                  }] registration fees 1 unit charge = ${
                                    system?.core_charge
                                      ? system?.core_charge
                                      : 1
                                  } USD`,
                                },
                                billing_from: wallet?.last_payment_date,
                                billing_to: moment().format(),
                                last_payment_date: wallet?.last_payment_date,
                                amount: system?.core_charge
                                  ? system?.core_charge
                                  : 1,
                              },
                            }
                          );
                        if (completeSubInvoice) {
                          const completeSubChargeDetails =
                            await SubChargeDetails.findOneAndUpdate(
                              { _id: subChargesDetails?._id },
                              {
                                $set: {
                                  main_invoice_no: existingInvoice?._id,
                                  sub_invoice_no: subInvoice?._id,
                                  main_charges_details: chargesDetails?._id,
                                  date: moment().format(),
                                  charge_type: `Player [${
                                    newPlayer?.name
                                  }] registration fees 1 unit charge = ${
                                    system?.core_charge
                                      ? system?.core_charge
                                      : 1
                                  } USD`,
                                  guardian_id: newPlayer?.guardian
                                    ? newPlayer?.guardian
                                    : "",
                                  player_id: newPlayer?._id,
                                  fees: system?.core_charge
                                    ? system?.core_charge
                                    : 1,
                                  billing_status: "unpaid",
                                  amount: system?.core_charge
                                    ? system?.core_charge
                                    : 1,
                                },
                              }
                            );
                          if (completeSubChargeDetails) {
                            const updateGuardian = await User.findOneAndUpdate(
                              { _id: guardian_id },
                              {
                                $inc: {
                                  inactive_player: 1,
                                  total_player: 1,
                                },
                              }
                            );
                            if (updateGuardian) {
                              const {
                                password: passwordHashed,
                                token,
                                ...sanitizedData
                              } = newPlayer?._doc;
                              sendLoginCredentials(email, password);
                              res.status(200).json(sanitizedData);
                            } else {
                              await User.findOneAndDelete({
                                _id: newPlayer?._id,
                              });
                              res.status(400).json({
                                message: "Can't update guardian!",
                              });
                            }
                          } else {
                            // delete subinvoice
                            SubInvoice.findOneAndDelete({
                              _id: subInvoice?._id,
                            });
                            // delete charges details
                            await ChargeDetails.findOneAndDelete({
                              _id: chargesDetails?._id,
                            });
                            // delete subcharges details
                            await SubChargeDetails.findOneAndDelete({
                              _id: subChargesDetails?._id,
                            });
                            // undo player status unpaid
                            await User.findOneAndDelete({
                              _id: newPlayer?._id,
                            });
                            // send response as unable to create transaction info
                            res.status(400).json({
                              message: "Can't create sub charges details!",
                            });
                          }
                        } else {
                          // delete subinvoice
                          SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                          // delete charges details
                          await ChargeDetails.findOneAndDelete({
                            _id: chargesDetails?._id,
                          });
                          // delete subcharges details
                          await SubChargeDetails.findOneAndDelete({
                            _id: subChargesDetails?._id,
                          });
                          // undo player status unpaid
                          await User.findOneAndDelete({ _id: newPlayer?._id });
                          // send response as unable to create transaction info
                          res.status(400).json({
                            message: "Can't create sub invoice!",
                          });
                        }
                      } else {
                        // delete subinvoice
                        SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                        // delete charges details
                        await ChargeDetails.findOneAndDelete({
                          _id: chargesDetails?._id,
                        });
                        // delete subcharges details
                        await SubChargeDetails.findOneAndDelete({
                          _id: subChargesDetails?._id,
                        });
                        // undo player status unpaid
                        await User.findOneAndDelete({ _id: newPlayer?._id });
                        // send response as unable to create transaction info
                        res.status(400).json({
                          message: "Can't create charges details!",
                        });
                      }
                    } else {
                      // delete subinvoice
                      SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                      // delete charges details
                      await ChargeDetails.findOneAndDelete({
                        _id: chargesDetails?._id,
                      });
                      // delete subcharges details
                      await SubChargeDetails.findOneAndDelete({
                        _id: subChargesDetails?._id,
                      });
                      // undo player status unpaid
                      await User.findOneAndDelete({ _id: newPlayer?._id });
                      // send response as unable to create transaction info
                      res.status(400).json({
                        message: "Can't create invoice!",
                      });
                    }
                  }
                } else {
                  const invoice = await Invoice.create({
                    created_by: admin?.email,
                    identity_type: "player registration",
                  });
                  const subInvoice = await SubInvoice.create({
                    created_by: admin?.email,
                    identity_type: "player registration",
                  });
                  const chargesDetails = await ChargeDetails.create({
                    created_by: admin?.email,
                    identity_type: "player registration",
                  });
                  const subChargesDetails = await SubChargeDetails.create({
                    created_by: admin?.email,
                    identity_type: "player registration",
                  });
                  if (
                    !invoice?._id ||
                    !subInvoice?._id ||
                    !chargesDetails?._id ||
                    !subChargesDetails?._id
                  ) {
                    isValidObjectId(invoice?._id) &&
                      (await Invoice.findOneAndDelete({ _id: invoice?._id }));
                    isValidObjectId(subInvoice?._id) &&
                      (await SubInvoice.findOneAndDelete({
                        _id: subInvoice?._id,
                      }));
                    isValidObjectId(chargesDetails?._id) &&
                      (await ChargeDetails.findOneAndDelete({
                        _id: chargesDetails?._id,
                      }));
                    isValidObjectId(subChargesDetails?._id) &&
                      (await SubChargeDetails.findOneAndDelete({
                        _id: subChargesDetails?._id,
                      }));

                    await User.findOneAndDelete({ _id: newPlayer?._id });
                    res.status(400).json({
                      message: "Can't Create invoices!",
                    });
                  } else {
                    const completeInvoice = await Invoice.findOneAndUpdate(
                      { _id: invoice?._id },
                      {
                        $set: {
                          billing_from: wallet?.last_payment_date,
                          billing_to: moment().format(),
                          bill_status: "unpaid",
                          last_payment_date: wallet?.last_payment_date,
                          // amount: system?.core_charge ? system?.core_charge : 1,
                        },
                      }
                    );
                    if (completeInvoice) {
                      const completeChargesDetails =
                        await ChargeDetails.findOneAndUpdate(
                          {
                            _id: chargesDetails?._id,
                          },
                          {
                            $set: {
                              invoice_no: invoice?._id,
                              date: moment().format(),
                              total_amount: wallet?.total_charges,
                              chages_type: `Player [${
                                newPlayer?.name
                              }] registration fees 1 unit charge = ${
                                system?.core_charge ? system?.core_charge : 1
                              } USD`,
                              guardian_id: newPlayer?.guardian
                                ? newPlayer?.guardian
                                : "",
                              player_id: newPlayer?._id,
                              fees: system?.core_charge
                                ? system?.core_charge
                                : 1,
                              billing_status: "unpaid",
                              amount: system?.core_charge
                                ? system?.core_charge
                                : 1,
                            },
                          }
                        );
                      if (completeChargesDetails) {
                        const completeSubInvoice =
                          await SubInvoice.findOneAndUpdate(
                            { _id: subInvoice?._id },
                            {
                              $set: {
                                main_invoice_no: invoice?._id,
                                charges_details: {
                                  id: subChargesDetails?._id,
                                  details: `Player [${
                                    newPlayer?.name
                                  }] registration fees 1 unit charge = ${
                                    system?.core_charge
                                      ? system?.core_charge
                                      : 1
                                  } USD`,
                                },
                                billing_from: wallet?.last_payment_date,
                                billing_to: moment().format(),
                                last_payment_date: wallet?.last_payment_date,
                                amount: system?.core_charge
                                  ? system?.core_charge
                                  : 1,
                              },
                            }
                          );
                        if (completeSubInvoice) {
                          const completeSubChargeDetails =
                            await SubChargeDetails.findOneAndUpdate(
                              { _id: subChargesDetails?._id },
                              {
                                $set: {
                                  main_invoice_no: invoice?._id,
                                  sub_invoice_no: subInvoice?._id,
                                  main_charges_details: chargesDetails?._id,
                                  date: moment().format(),
                                  charge_type: `Player [${
                                    newPlayer?.name
                                  }] registration fees 1 unit charge = ${
                                    system?.core_charge
                                      ? system?.core_charge
                                      : 1
                                  } USD`,
                                  guardian_id: newPlayer?.guardian
                                    ? newPlayer?.guardian
                                    : "",
                                  player_id: newPlayer?._id,
                                  fees: system?.core_charge
                                    ? system?.core_charge
                                    : 1,
                                  billing_status: "unpaid",
                                  amount: system?.core_charge
                                    ? system?.core_charge
                                    : 1,
                                },
                              }
                            );
                          if (completeSubChargeDetails) {
                            const updateGuardian = await User.findOneAndUpdate(
                              { _id: guardian_id },
                              {
                                $inc: {
                                  inactive_player: 1,
                                  total_player: 1,
                                },
                              }
                            );
                            if (updateGuardian) {
                              const {
                                password: passwordHashed,
                                token,
                                ...sanitizedData
                              } = newPlayer?._doc;
                              sendLoginCredentials(email, password);
                              res.status(200).json(sanitizedData);
                            } else {
                              await User.findOneAndDelete({
                                _id: newPlayer?._id,
                              });
                              res.status(400).json({
                                message: "Can't update guardian!",
                              });
                            }
                          } else {
                            // delete invoice
                            Invoice.findOneAndDelete({ _id: invoice?._id });
                            // delete subinvoice
                            SubInvoice.findOneAndDelete({
                              _id: subInvoice?._id,
                            });
                            // delete charges details
                            await ChargeDetails.findOneAndDelete({
                              _id: chargesDetails?._id,
                            });
                            // delete subcharges details
                            await SubChargeDetails.findOneAndDelete({
                              _id: subChargesDetails?._id,
                            });
                            // undo player status unpaid
                            await User.findOneAndDelete({
                              _id: newPlayer?._id,
                            });
                            // send response as unable to create transaction info
                            res.status(400).json({
                              message: "Can't create sub charges details!",
                            });
                          }
                        } else {
                          // delete invoice
                          Invoice.findOneAndDelete({ _id: invoice?._id });
                          // delete subinvoice
                          SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                          // delete charges details
                          await ChargeDetails.findOneAndDelete({
                            _id: chargesDetails?._id,
                          });
                          // delete subcharges details
                          await SubChargeDetails.findOneAndDelete({
                            _id: subChargesDetails?._id,
                          });
                          // undo player status unpaid
                          await User.findOneAndDelete({ _id: newPlayer?._id });
                          // send response as unable to create transaction info
                          res.status(400).json({
                            message: "Can't create sub invoice!",
                          });
                        }
                      } else {
                        // delete invoice
                        Invoice.findOneAndDelete({ _id: invoice?._id });
                        // delete subinvoice
                        SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                        // delete charges details
                        await ChargeDetails.findOneAndDelete({
                          _id: chargesDetails?._id,
                        });
                        // delete subcharges details
                        await SubChargeDetails.findOneAndDelete({
                          _id: subChargesDetails?._id,
                        });
                        // undo player status unpaid
                        await User.findOneAndDelete({ _id: newPlayer?._id });
                        // send response as unable to create transaction info
                        res.status(400).json({
                          message: "Can't create charges details!",
                        });
                      }
                    } else {
                      // delete invoice
                      Invoice.findOneAndDelete({ _id: invoice?._id });
                      // delete subinvoice
                      SubInvoice.findOneAndDelete({ _id: subInvoice?._id });
                      // delete charges details
                      await ChargeDetails.findOneAndDelete({
                        _id: chargesDetails?._id,
                      });
                      // delete subcharges details
                      await SubChargeDetails.findOneAndDelete({
                        _id: subChargesDetails?._id,
                      });
                      // undo player status unpaid
                      await User.findOneAndDelete({ _id: newPlayer?._id });
                      // send response as unable to create transaction info
                      res.status(400).json({
                        message: "Can't create invoice!",
                      });
                    }
                  }
                }
              } else {
                res.status(400).json({
                  message: "Can not add Player. Please try again!",
                });
              }
            }
          } else {
            res.status(400).json({
              message: "Can't find admin!",
            });
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
          if (player?.payment_status && player?.payment_status === "paid") {
            const updateGuardian = await User.findOneAndUpdate(
              { _id: guardian?._id },
              {
                $inc: {
                  active_player: 1,
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
        if (typeof player?.team === "object" && player?.team?.length > 0) {
          // convert ID string to ObjectId...
          // const newId = player?.team?.map((t) => ObjectId(t));
          // const obj = [...newId];

          const playersTeam = player?.team?.map(
            (t) => isValidObjectId(t) && ObjectId(t)
          );
          const allTeams = await Team.find({
            _id: { $in: [...playersTeam] },
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
