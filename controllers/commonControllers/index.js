const { getPlayerRegistrationFee } = require("./feesAndCurrencyController");
const {
  stripePaymentIntent,
  createTransaction,
  myTransaction,
} = require("./paymentController");
const { updateUserAditionalInfo } = require("./userController/userController");

module.exports = {
  updateUserAdintionInfoController: updateUserAditionalInfo,
  stripePaymentIntentController: stripePaymentIntent,
  createTransactionController: createTransaction,
  myTransactionsController: myTransaction,
  getPlayerRegistrationFeeController: getPlayerRegistrationFee,
};
