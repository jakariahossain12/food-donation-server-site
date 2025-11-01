const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/index");
const {
  createPaymentIntent,
  savePayment,
  getCharityRequestStatus,
  getLatestCharityRequests,
} = require("../controllers/payment");

router.post("/create-payment-intent", verifyToken, createPaymentIntent);
router.post("/save-payment", verifyToken, savePayment);
router.get("/charity-request-status", verifyToken, getCharityRequestStatus);
router.get("/charity-requests/latest", getLatestCharityRequests);

module.exports = router;