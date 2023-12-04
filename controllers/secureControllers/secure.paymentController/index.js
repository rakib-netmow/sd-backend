const isValidObjectId = require("../../../config/checkValidObjectId");
const ChargeDetails = require("../../../model/invoice/chargeDetailsModel");
const Invoice = require("../../../model/invoice/invoiceModel");
const SubChargeDetails = require("../../../model/invoice/subChargeDetails");
const SubInvoice = require("../../../model/invoice/subInvoiceModel");
const SystemAuthority = require("../../../model/systemAuthority/systemAuthorityModel");
const Transaction = require("../../../model/transactions/transactionsModel");
const Wallet = require("../../../model/wallet/walletModel");
const moment = require("moment/moment");

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
    } else if (!isValidObjectId(admin_id)) {
      res.status(400).json({
        message: "Invalid Admin id!",
      });
    } else {
      const player = await User.findOne({
        $and: [{ _id: player_id }, { role: "player" }],
      });
      const system = await SystemAuthority.findOne({});
      if (player && player?._id) {
        const admin = await User.findOne({
          $and: [{ _id: admin_id }, { role: "admin" }],
        });
        if (admin && admin?._id && admin?.player_registration_fee) {
          const wallet = await Wallet.findOne({ admin_id });
          // if (wallet?._id) {
          // } else {
          //   const newWalet = await Wallet.create({
          //     admin_id: admin?._id,
          //     admin_email: admin?.email,
          //     total_charges: "0",
          //     last_payment_date: moment(),
          //     created_by: admin?.email,
          //   });
          // }
          const updatePlayer = await User.findOneAndUpdate(
            {
              $and: [{ _id: admin_id }, { role: "admin" }],
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
                  (await SubInvoice.findOneAndDelete({ _id: subInvoice?._id }));
                isValidObjectId(chargesDetails?._id) &&
                  (await ChargeDetails.findOneAndDelete({
                    _id: chargesDetails?._id,
                  }));
                isValidObjectId(subChargesDetails?._id) &&
                  (await SubChargeDetails.findOneAndDelete({
                    _id: subChargesDetails?._id,
                  }));
                // detele transaction
                await Transaction.findOneAndDelete({ _id: transaction?._id });
                // undo the player payment status to unpaid
                await User.findOneAndUpdate(
                  {
                    $and: [{ _id: admin_id }, { role: "admin" }],
                  },
                  {
                    $set: {
                      payment_status: "unpaid",
                    },
                  }
                );
                // send response as unable to create invoice or charges
                res.status(400).json({
                  message: "Can't create invoice or charges!",
                });
              } else {
                const completeInvoice = await Invoice.findOneAndUpdate(
                  { _id: invoice?._id },
                  {
                    $push: {
                      charges_details: {
                        chargesDetailsId: chargesDetails?._id,
                        subInvoiceId: subInvoice?._id,
                        details: `Player[${
                          player?.name
                        }] registration fees 1 unit charge = ${
                          system?.core_charge ? system?.core_charge : 1
                        } USD`,
                      },
                    },
                    $set: {
                      billing_from: wallet?.last_payment_date,
                      billing_from: moment(),
                      bill_status: "unpaid",
                      last_payment_date: wallet?.last_payment_date,
                      amount: system?.core_charge ? system?.core_charge : 1,
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
                          date: moment(),
                          total_amount: wallet?.total_charges,
                          chages_type: `Player[${
                            player?.name
                          }] registration fees 1 unit charge = ${
                            system?.core_charge ? system?.core_charge : 1
                          } USD`,
                          guardian_id: player?.guardian ? player?.guardian : "",
                          player_id: player?._id,
                          fees: system?.core_charge ? system?.core_charge : 1,
                          billing_status: "unpaid",
                          amount: system?.core_charge ? system?.core_charge : 1,
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
                              details: `Player[${
                                player?.name
                              }] registration fees 1 unit charge = ${
                                system?.core_charge ? system?.core_charge : 1
                              } USD`,
                            },
                            billing_from: wallet?.last_payment_date,
                            billing_to: moment(),
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
                              date: moment(),
                              charge_type: `Player[${
                                player?.name
                              }] registration fees 1 unit charge = ${
                                system?.core_charge ? system?.core_charge : 1
                              } USD`,
                              guardian_id: player?.guardian
                                ? player?.guardian
                                : "",
                              player_id: player?._id,
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
                        res.status(200).json({
                          message: "Player payment is successfully completed.",
                        });
                      } else {
                        // delete transaction
                        await Transaction.findOneAndDelete({
                          _id: transaction?._id,
                        });
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
                        await User.findOneAndUpdate(
                          {
                            $and: [{ _id: admin_id }, { role: "admin" }],
                          },
                          {
                            $set: {
                              payment_status: "unpaid",
                            },
                          }
                        );
                        // send response as unable to create transaction info
                        res.status(400).json({
                          message: "Can't create sub charges details!",
                        });
                      }
                    } else {
                      // delete transaction
                      await Transaction.findOneAndDelete({
                        _id: transaction?._id,
                      });
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
                      await User.findOneAndUpdate(
                        {
                          $and: [{ _id: admin_id }, { role: "admin" }],
                        },
                        {
                          $set: {
                            payment_status: "unpaid",
                          },
                        }
                      );
                      // send response as unable to create transaction info
                      res.status(400).json({
                        message: "Can't create sub invoice!",
                      });
                    }
                  } else {
                    // delete transaction
                    await Transaction.findOneAndDelete({
                      _id: transaction?._id,
                    });
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
                    await User.findOneAndUpdate(
                      {
                        $and: [{ _id: admin_id }, { role: "admin" }],
                      },
                      {
                        $set: {
                          payment_status: "unpaid",
                        },
                      }
                    );
                    // send response as unable to create transaction info
                    res.status(400).json({
                      message: "Can't create charges details!",
                    });
                  }
                } else {
                  // delete transaction
                  await Transaction.findOneAndDelete({
                    _id: transaction?._id,
                  });
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
                  await User.findOneAndUpdate(
                    {
                      $and: [{ _id: admin_id }, { role: "admin" }],
                    },
                    {
                      $set: {
                        payment_status: "unpaid",
                      },
                    }
                  );
                  // send response as unable to create transaction info
                  res.status(400).json({
                    message: "Can't create invoice!",
                  });
                }
              }
            } else {
              await User.findOneAndUpdate(
                {
                  $and: [{ _id: admin_id }, { role: "admin" }],
                },
                {
                  $set: {
                    payment_status: "unpaid",
                  },
                }
              );
            }
            res.status(400).json({
              message: "Can't create transaction info!",
            });
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
          message: "Can't find player!",
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

module.exports = {
  allTransactions,
  paidByCashForPlayer,
};
