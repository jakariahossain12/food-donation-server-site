const mongoose = require("mongoose");
const Review = require("../models/review");

// Add a review to a donation
async function addDonationReview(req, res) {
  try {
    const review = req.body;

    if (!review.donationId || !review.reviewerEmail || !review.rating) {
      return res.status(400).json({ error: "Missing required review fields" });
    }

    const newReview = new Review(review);
    const saved = await newReview.save();

    res.status(201).json({ message: "Review added", id: saved._id });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

// Get reviews for a specific donation
async function getDonationReviews(req, res) {
  try {
    const donationId = req.query.id;

    if (!donationId) {
      return res.status(400).json({ error: "Donation ID is required" });
    }

    const reviews = await Review.find({ donationId });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

// Get reviews by restaurant email
async function getRestaurantReviews(req, res) {
  try {
    const restaurantEmail = req.params.id;

    const reviews = await Review.find({ restaurantEmail });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

// Delete a review by ID
async function deleteReviewById(req, res) {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }

    const result = await Review.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

module.exports = {
  addDonationReview,
  getDonationReviews,
  getRestaurantReviews,
  deleteReviewById,
};