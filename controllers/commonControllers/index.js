const { getPlayerRegistrationFee } = require("./feesAndCurrencyController");
const {
  stripePaymentIntent,
  createTransaction,
  myTransaction,
} = require("./paymentController");
const {
  updateUserAditionalInfo,
  userInfo,
} = require("./userController/userController");

module.exports = {
  updateUserAdintionInfoController: updateUserAditionalInfo,
  stripePaymentIntentController: stripePaymentIntent,
  createTransactionController: createTransaction,
  myTransactionsController: myTransaction,
  getPlayerRegistrationFeeController: getPlayerRegistrationFee,
  userInfoController: userInfo,
};
