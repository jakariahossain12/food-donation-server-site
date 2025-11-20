const mongoose = require("mongoose");
const Donation = require("../models/donation");

// Get all donations (admin)
async function getAllDonations(req, res) {
  try {
    const result = await Donation.find();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Verify donation by admin
async function verifyDonation(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await Donation.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { status } }
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all verified donations (admin)
async function getVerifiedDonations(req, res) {
  try {
    const result = await Donation.find({ status: "Verified" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Add a new donation
async function addDonation(req, res) {
  try {
    const donationData = req.body;
    const result = await Donation.create(donationData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get verified donations for users (with optional location search)
async function getPublicVerifiedDonations(req, res) {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const filter = {
      status: "Verified",
      ...(search && {
        location: { $regex: search, $options: "i" },
      }),
    };

    const total = await Donation.countDocuments(filter);
    const result = await Donation.find(filter)
      .sort({ create: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      donations: result,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

// Get donations by restaurant
async function getMyDonations(req, res) {
  try {
    const email = req.query.email;
    const result = await Donation.find({ email });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete donation by ID
async function deleteDonation(req, res) {
  try {
    const { id } = req.query;
    const result = await Donation.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get one donation by ID
async function getOneDonation(req, res) {
  try {
    const { id } = req.query;
    const result = await Donation.findById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update donation by ID
async function updateDonation(req, res) {
  try {
    const { id } = req.params;
    const donationData = req.body;

    const result = await Donation.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: donationData }
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get donation statistics for restaurant
async function getDonationStats(req, res) {
  try {
    const email = req.user.email;

    const pipeline = [
      { $match: { email, status: "Verified" } },
      {
        $group: {
          _id: "$type",
          quantity: { $sum: { $toInt: "$quantity" } },
        },
      },
      {
        $project: {
          _id: 0,
          type: "$_id",
          quantity: 1,
        },
      },
    ];

    const result = await Donation.aggregate(pipeline);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Feature a donation (admin)
async function featureDonation(req, res) {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await Donation.findByIdAndUpdate(
      id,
      { $set: { featured: true } },
      { new: true }

    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get featured donations (max 4)
async function getFeaturedDonations(req, res) {
  try {
    const result = await Donation.find({ featured: true }).sort({ create: -1 }).limit(4);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch featured donations", error: error.message });
  }
}

module.exports = {
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
};