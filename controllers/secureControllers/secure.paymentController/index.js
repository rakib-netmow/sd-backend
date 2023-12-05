const isValidObjectId = require("../../../config/checkValidObjectId");
const ChargeDetails = require("../../../model/invoice/chargeDetailsModel");
const Invoice = require("../../../model/invoice/invoiceModel");
const SubChargeDetails = require("../../../model/invoice/subChargeDetails");
const SubInvoice = require("../../../model/invoice/subInvoiceModel");
const SystemAuthority = require("../../../model/systemAuthority/systemAuthorityModel");
const Transaction = require("../../../model/transactions/transactionsModel");
const User = require("../../../model/user/userModel");
const Wallet = require("../../../model/wallet/walletModel");
const moment = require("moment");

// admin paid by cash
const paidByCashForPlayer = async (req, res) => {
  try {
    const player_id = req.params.id;
    const admin_id = req.auth.id;
    if (!player_id) {
      req.status(400).json({
        message: "Player id is missing!",
      });
    } else if (!isValidObjectId(player_id)) {
      res.status(400).json({
        message: "Invalid Player id!",
      });
    } else if (!admin_id) {
      req.status(400).json({
        message: "Admin id is missing!",
      });
    } else {
      const player = await User.findOne({
        $and: [{ _id: player_id }, { role: "player" }],
      });
      const system = await SystemAuthority.findOne({});
      if (player && player?._id && player?.payment_status === "unpaid") {
        const admin = await User.findOne({
          $and: [{ email: admin_id }, { role: "admin" }],
        });
        if (admin && admin?._id) {
          const wallet = await Wallet.findOne({ admin_id: admin?._id });
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
          const updatePlayer = await User.findOneAndUpdate(
            {
              $and: [{ _id: player_id }, { role: "player" }],
            },
            {
              $set: {
                payment_status: "paid",
              },
            }
          );
          if (updatePlayer) {
            const transaction = await Transaction.create({
              payment_for_title: "player registration",
              payment_for_id: player?._id,
              amount: admin?.player_registration_fee,
              payment_method: "cash",
              status: "paid",
              admin_email: admin?.email,
            });
            if (transaction) {
              // update wallet
              const updateWallet = await Wallet.findOneAndUpdate(
                {
                  $and: [
                    { admin_id: admin?._id },
                    { created_by: admin?.email },
                  ],
                },
                {
                  $set: {
                    total_charges:
                      parseFloat(wallet?.total_charges) +
                      (system?.core_charge
                        ? parseFloat(system?.core_charge)
                        : 1),
                  },
                }
              );
              if (updateWallet) {
                // update charges details
                const chargesDetails = await ChargeDetails.findOne({
                  $and: [
                    { identity_type: "player registration" },
                    { created_by: admin?.email },
                    { player_id },
                  ],
                });
                if (chargesDetails) {
                  const updateChargesDetails =
                    await ChargeDetails.findOneAndUpdate(
                      {
                        $and: [
                          { identity_type: "player registration" },
                          { created_by: admin?.email },
                          { player_id },
                        ],
                      },
                      {
                        $set: {
                          total_amount:
                            parseFloat(chargesDetails?.total_amount) +
                            (system?.core_charge
                              ? parseFloat(system?.core_charge)
                              : 1),
                        },
                      }
                    );
                  if (updateChargesDetails) {
                    // update sub charges details
                    const subChargesDetails = await SubChargeDetails.findOne({
                      $and: [
                        { identity_type: "player registration" },
                        { created_by: admin?.email },
                        { player_id },
                      ],
                    });
                    if (subChargesDetails) {
                      const updateSubChargesDetails =
                        await SubChargeDetails.findOneAndUpdate(
                          {
                            $and: [
                              { identity_type: "player registration" },
                              { created_by: admin?.email },
                              { player_id },
                            ],
                          },
                          {
                            $set: {
                              total_amount:
                                parseFloat(subChargesDetails?.total_amount) +
                                (system?.core_charge
                                  ? parseFloat(system?.core_charge)
                                  : 1),
                            },
                          }
                        );
                      if (updateSubChargesDetails) {
                        res.status(200).json({
                          message: "Player payment successfull.",
                        });
                      } else {
                        await Transaction.findOneAndDelete({
                          $and: [
                            { admin_email: admin?.email },
                            { payment_for_id: player_id },
                          ],
                        });
                        await ChargeDetails.findOneAndUpdate(
                          {
                            $and: [
                              { identity_type: "player registration" },
                              { created_by: admin?.email },
                              { player_id },
                            ],
                          },
                          {
                            $set: {
                              total_amount:
                                parseFloat(chargesDetails?.total_amount) -
                                (system?.core_charge
                                  ? parseFloat(system?.core_charge)
                                  : 1),
                            },
                          }
                        );
                        await Wallet.findOneAndUpdate(
                          {
                            $and: [
                              { admin_id: admin?._id },
                              { created_by: admin?.email },
                            ],
                          },
                          {
                            $set: {
                              total_charges:
                                parseFloat(wallet?.total_charges) -
                                (system?.core_charge
                                  ? parseFloat(system?.core_charge)
                                  : 1),
                            },
                          }
                        );
                        await User.findOneAndUpdate(
                          {
                            $and: [{ _id: player_id }, { role: "player" }],
                          },
                          {
                            $set: {
                              payment_status: "unpaid",
                            },
                          }
                        );
                        res.status(400).json({
                          message: "Can't update sub charges details!",
                        });
                      }
                    } else {
                      await Transaction.findOneAndDelete({
                        $and: [
                          { admin_email: admin?.email },
                          { payment_for_id: player_id },
                        ],
                      });
                      await ChargeDetails.findOneAndUpdate(
                        {
                          $and: [
                            { identity_type: "player registration" },
                            { created_by: admin?.email },
                            { player_id },
                          ],
                        },
                        {
                          $set: {
                            total_amount:
                              parseFloat(chargesDetails?.total_amount) -
                              (system?.core_charge
                                ? parseFloat(system?.core_charge)
                                : 1),
                          },
                        }
                      );
                      await Wallet.findOneAndUpdate(
                        {
                          $and: [
                            { admin_id: admin?._id },
                            { created_by: admin?.email },
                          ],
                        },
                        {
                          $set: {
                            total_charges:
                              parseFloat(wallet?.total_charges) -
                              (system?.core_charge
                                ? parseFloat(system?.core_charge)
                                : 1),
                          },
                        }
                      );
                      await User.findOneAndUpdate(
                        {
                          $and: [{ _id: player_id }, { role: "player" }],
                        },
                        {
                          $set: {
                            payment_status: "unpaid",
                          },
                        }
                      );
                      res.status(400).json({
                        message: "Can't find sub charges details!",
                      });
                    }
                  } else {
                    await Transaction.findOneAndDelete({
                      $and: [
                        { admin_email: admin?.email },
                        { payment_for_id: player_id },
                      ],
                    });
                    await Wallet.findOneAndUpdate(
                      {
                        $and: [
                          { admin_id: admin?._id },
                          { created_by: admin?.email },
                        ],
                      },
                      {
                        $set: {
                          total_charges:
                            parseFloat(wallet?.total_charges) -
                            (system?.core_charge
                              ? parseFloat(system?.core_charge)
                              : 1),
                        },
                      }
                    );
                    await User.findOneAndUpdate(
                      {
                        $and: [{ _id: player_id }, { role: "player" }],
                      },
                      {
                        $set: {
                          payment_status: "unpaid",
                        },
                      }
                    );
                    res.status(400).json({
                      message: "Can't update charges details!",
                    });
                  }
                } else {
                  await Transaction.findOneAndDelete({
                    $and: [
                      { admin_email: admin?.email },
                      { payment_for_id: player_id },
                    ],
                  });
                  await Wallet.findOneAndUpdate(
                    {
                      $and: [
                        { admin_id: admin?._id },
                        { created_by: admin?.email },
                      ],
                    },
                    {
                      $set: {
                        total_charges:
                          parseFloat(wallet?.total_charges) -
                          (system?.core_charge
                            ? parseFloat(system?.core_charge)
                            : 1),
                      },
                    }
                  );
                  await User.findOneAndUpdate(
                    {
                      $and: [{ _id: player_id }, { role: "player" }],
                    },
                    {
                      $set: {
                        payment_status: "unpaid",
                      },
                    }
                  );
                  res.status(400).json({
                    message: "Can't find charges details!",
                  });
                }
              } else {
                await Transaction.findOneAndDelete({
                  $and: [
                    { admin_email: admin?.email },
                    { payment_for_id: player_id },
                  ],
                });
                await User.findOneAndUpdate(
                  {
                    $and: [{ _id: player_id }, { role: "player" }],
                  },
                  {
                    $set: {
                      payment_status: "unpaid",
                    },
                  }
                );
                res.status(400).json({
                  message: "Can't update charges!",
                });
              }
            } else {
              await User.findOneAndUpdate(
                {
                  $and: [{ _id: player_id }, { role: "player" }],
                },
                {
                  $set: {
                    payment_status: "unpaid",
                  },
                }
              );
              res.status(400).json({
                message: "Can't create transaction info!",
              });
            }
          } else {
            res.status(400).json({
              message: "Can't update player payment status!",
            });
          }
        } else {
          // cant find admin
          res.status(400).json({
            message: "Can't find admin!",
          });
        }
      } else {
        // cant find player
        res.status(400).json({
          message: "Can't find player or player's payment is clear!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const allTransactions = async (req, res) => {
  try {
    const created_by = req.auth.id;
    const transactions = await Transaction.find({ created_by });
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
  }
};

const getTotalCharge = async (req, res) => {
  try {
    const id = req?.auth?.id;
    if (!id) {
      res.status(400).json({
        message: "Invalid admin ID",
      });
    } else {
      const wallet = await Wallet.findOne({ admin_email: id });
      if (wallet) {
        res.status(200).json(wallet);
      } else {
        res.status(400).json({
          message: "Can't find wallet!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  allTransactions,
  paidByCashForPlayer,
  getTotalCharge,
};
