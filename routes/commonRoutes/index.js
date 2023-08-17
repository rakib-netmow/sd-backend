const express = require("express");
const {
  updateUserAdintionInfoController,
} = require("../../controllers/commonControllers");
const { verifyJWT } = require("../../middleware/authMiddleware");
const router = express.Router();

router.use(verifyJWT);

router.put("/user-additional-info", updateUserAdintionInfoController);

module.exports = router;
