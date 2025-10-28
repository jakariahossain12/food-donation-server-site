const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/index");
const {
  createPaymentIntent,
  savePayment,
  getCharityRequestStatus,
} = require("../controllers/payment");

router.post("/create-payment-intent", createPaymentIntent);
router.post("/save-payment", savePayment);
router.get("/charity-request-status", getCharityRequestStatus);

module.exports = router;