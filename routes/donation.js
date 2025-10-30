const express = require("express");
const router = express.Router();
const {
  verifyToken,
  adminVerify,
  restaurantVerify,
} = require("../middlewares/index");

const {
  getAllDonations,
  verifyDonation,
  getVerifiedDonations,
  addDonation,
  getPublicVerifiedDonations,
  getMyDonations,
  deleteDonation,
  getOneDonation,
  updateDonation,
  getDonationStats,
  featureDonation,
  getFeaturedDonations,
} = require("../controllers/donation");

router.get("/all", verifyToken, getAllDonations);
router.patch("/status/:id", verifyToken, adminVerify, verifyDonation);
router.get("/verified", verifyToken, getVerifiedDonations);
router.post("/add", verifyToken, addDonation);
router.get("/public", getPublicVerifiedDonations);
router.get("/mine", verifyToken, restaurantVerify, getMyDonations);
router.delete("/", verifyToken, restaurantVerify, deleteDonation);
router.get("/one", getOneDonation);
router.put("/update/:id", verifyToken, restaurantVerify, updateDonation);
router.get("/stats", verifyToken, getDonationStats);
router.patch("/feature/:id", verifyToken, adminVerify, featureDonation);
router.get("/featured", getFeaturedDonations);

module.exports = router;