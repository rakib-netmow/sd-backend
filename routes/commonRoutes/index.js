const express = require("express");
const {
  updateUserAdintionInfoController,
  stripePaymentIntentController,
  createTransactionController,
  myTransactionsController,
  getPlayerRegistrationFeeController,
  userInfoController,
} = require("../../controllers/commonControllers");
const { verifyJWT } = require("../../middleware/authMiddleware");
const router = express.Router();

router.use(verifyJWT);

router.put("/user-additional-info", updateUserAdintionInfoController);
router.post("/stripe-payment-intent", stripePaymentIntentController);
router.post("/transaction", createTransactionController);
router.get("/transaction", myTransactionsController);
router.get("/player-registration-fee", getPlayerRegistrationFeeController);
router.get("/userinfo", userInfoController);

module.exports = router;
