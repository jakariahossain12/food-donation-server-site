const mongoose = require("mongoose");
const User = require("../models/user");
const Donation = require("../models/donation");
const DonationRequest = require("../models/request");
const Payment = require("../models/payment");

// Get user overview stats by role
async function getUserStats(req, res) {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "restaurant") {
      const donationsPosted = await Donation.countDocuments({ email });
      const requestsReceived = await DonationRequest.countDocuments({ restaurantEmail: email });
      const donationsCompleted = await DonationRequest.countDocuments({
        restaurantEmail: email,
        status: "PickedUp",
      });

      return res.status(200).json({
        donationsPosted,
        requestsReceived,
        donationsCompleted,
      });
    }

    if (user.role === "charity") {
      const requestsMade = await DonationRequest.countDocuments({ charityEmail: email });
      const approvedRequests = await DonationRequest.countDocuments({
        charityEmail: email,
        status: "PickedUp",
      });

      return res.status(200).json({
        requestsMade,
        approvedRequests,
      });
    }

    if (user.role === "admin") {
      const usersCount = await User.countDocuments();
      const donationsCount = await Donation.countDocuments();
      const requestsCount = await DonationRequest.countDocuments();
      const successfulDonations = await Payment.countDocuments({ status: "Approved" });

      return res.status(200).json({
        usersCount,
        donationsCount,
        requestsCount,
        successfulDonations,
      });
    }

    res.status(400).json({ error: "Unsupported role" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getUserStats,
};