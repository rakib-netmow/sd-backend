const isValidObjectId = require("../../../config/checkValidObjectId");
const ChargeDetails = require("../../../model/invoice/chargeDetailsModel");
const Invoice = require("../../../model/invoice/invoiceModel");
const SubChargeDetails = require("../../../model/invoice/subChargeDetails");
const SubInvoice = require("../../../model/invoice/subInvoiceModel");
const SystemAuthority = require("../../../model/systemAuthority/systemAuthorityModel");
const Transaction = require("../../../model/transactions/transactionsModel");

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
              });
              const subInvoice = await SubInvoice.create({
                created_by: admin?.email,
              });
              const chargesDetails = await ChargeDetails.create({
                created_by: admin?.email,
              });
              const subChargesDetails = await SubChargeDetails.create({
                created_by: admin?.email,
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
                // undo the player payment status unpaid
                // send response as unable to create invoice or charges
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
                    $set: {},
                  }
                );
              }
            } else {
              // undo the player payment status unpaid
              // send response as unable to create transaction info
            }
          } else {
            // cant update player payment info
          }
        } else {
          // cant find admin
        }
      } else {
        // cant find player
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
};
