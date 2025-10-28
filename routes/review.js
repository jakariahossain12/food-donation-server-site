const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/index");
const {
  addDonationReview,
  getDonationReviews,
  getRestaurantReviews,
  deleteReviewById,
} = require("../controllers/review");

router.post("/donation-review", addDonationReview);
router.get("/", getDonationReviews);
router.get("/:id", getRestaurantReviews);
router.delete("/:id", deleteReviewById);

module.exports = router;