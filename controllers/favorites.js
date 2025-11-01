const mongoose = require("mongoose");
const Favorite = require("../models/favorites");

// Save favorite donation
async function handelSaveFavoriteData(req, res) {
  try {
    const { donationId, userEmail } = req.body;

    if (!donationId || !userEmail) {
      return res.status(400).json({ error: "donationId and userEmail are required" });
    }

    const exists = await Favorite.findOne({
      donationId: new mongoose.Types.ObjectId(donationId),
      userEmail,
    });

    if (exists) {
      return res.status(409).json({ message: "Already saved." });
    }

    const newFavorite = new Favorite({
      ...req.body,
      donationId: new mongoose.Types.ObjectId(donationId),
      savedAt: new Date(),
    });

    const saved = await newFavorite.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

// Get favorites by user email
async function handelGetFavoriteDataByEmail(req, res) {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ error: "Email query parameter is required" });
    }

    const favorites = await Favorite.aggregate([
      { $match: { userEmail: email } },
      {
        $lookup: {
          from: "donations",
          localField: "donationId",
          foreignField: "_id",
          as: "donationInfo",
        },
      },
      { $unwind: "$donationInfo" },
      {
        $project: {
          _id: 1,
          donationId: "$donationInfo._id",
          title: "$donationInfo.title",
          image: "$donationInfo.image",
          name: "$donationInfo.name",
          location: "$donationInfo.location",
          status: "$donationInfo.status",
          quantity: "$donationInfo.quantity",
        },
      },
    ]);

    res.status(200).json({ favorites });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

// Delete favorite by ID
async function handelDeleteFavoriteDataById(req, res) {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid favorite ID" });
    }

    const result = await Favorite.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

module.exports = {
  handelSaveFavoriteData,
  handelGetFavoriteDataByEmail,
  handelDeleteFavoriteDataById,
};