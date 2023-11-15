const Transaction = require("../../../model/transactions/transactionsModel");

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
