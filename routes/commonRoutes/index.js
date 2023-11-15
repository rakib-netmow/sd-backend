const express = require("express");
const {
  updateUserAdintionInfoController,
  stripePaymentIntentController,
  createTransactionController,
  myTransactionsController,
} = require("../../controllers/commonControllers");
const { verifyJWT } = require("../../middleware/authMiddleware");
const router = express.Router();

router.use(verifyJWT);

router.put("/user-additional-info", updateUserAdintionInfoController);
router.post("/stripe-payment-intent", stripePaymentIntentController);
router.post("/transaction", createTransactionController);
router.get("/transaction", myTransactionsController);

module.exports = router;
