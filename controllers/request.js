const mongoose = require("mongoose");
const DonationRequest = require("../models/request");
const Donation = require("../models/donation");

// Get all donation requests (admin or general)
async function getAllRequests(req, res) {
  try {
    const requests = await DonationRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete donation request by ID (admin)
async function deleteRequestById(req, res) {
  try {
    const { id } = req.params;
    const result = await DonationRequest.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Send donation request (charity)
async function sendRequest(req, res) {
  try {
    const { charityEmail, donationId } = req.body;
    const exists = await DonationRequest.findOne({ donationId, charityEmail });

    if (exists) {
      return res.status(409).json({ message: "Already requested." });
    }

    const newRequest = new DonationRequest(req.body);
    const saved = await newRequest.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get requests by restaurant email
async function getRequestsByRestaurant(req, res) {
  try {
    const { email } = req.query;
    const result = await DonationRequest.find({ restaurantEmail: email }).sort({ requestedAt: -1 });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get requests by charity email
async function getRequestsByCharity(req, res) {
  try {
    const { email } = req.query;
    const result = await DonationRequest.find({ charityEmail: email });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update request status (restaurant)
async function updateRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const query = { _id: new mongoose.Types.ObjectId(id) };
    const request = await DonationRequest.findOne(query);

    if (!request) return res.status(404).json({ message: "Request not found" });

    const update = status === "Accepted"
      ? { $set: { status, pickup_status: "Assigned" } }
      : { $set: { status } };

    await DonationRequest.updateOne(query, update);

    if (status === "Accepted") {
      await DonationRequest.updateMany(
        { donationId: request.donationId, _id: { $ne: query._id } },
        { $set: { status: "Rejected" } }
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteOwnRequest(req, res) {
  try {
    const { id } = req.params;
    const userEmail = req.user.email;

    const request = await DonationRequest.findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.charityEmail !== userEmail && request.restaurantEmail !== userEmail) {
      return res.status(403).json({ message: "You are not authorized to delete this request" });
    }

    const result = await DonationRequest.deleteOne({ _id: request._id });
    res.status(200).json({ message: "Request deleted", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}






// Confirm pickup and update both donation and request
async function confirmPickup(req, res) {
  try {
    const { id } = req.params;
    const filter = { _id: new mongoose.Types.ObjectId(id) };
    const request = await DonationRequest.findOne(filter);

    if (!request) return res.status(404).json({ message: "Request not found" });

    const donationId = request.donationId;
    const update = {
      $set: {
        status: "PickedUp",
        pickedUpAt: new Date().toISOString(),
      },
    };

    await Donation.updateOne({ _id: new mongoose.Types.ObjectId(donationId) }, update);
    const result = await DonationRequest.updateOne(filter, update);

    res.status(200).json({ success: result.modifiedCount > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get accepted pickups for charity
async function getAcceptedPickups(req, res) {
  try {
    const { email } = req.query;
    const result = await DonationRequest.aggregate([
      { $match: { charityEmail: email, status: "Accepted" } },
      { $addFields: { donationObjectId: { $toObjectId: "$donationId" } } },
      {
        $lookup: {
          from: "donations",
          localField: "donationObjectId",
          foreignField: "_id",
          as: "donationInfo",
        },
      },
      { $unwind: "$donationInfo" },
      {
        $project: {
          _id: 1,
          donationTitle: 1,
          restaurantName: 1,
          pickupTime: 1,
          status: 1,
          location: "$donationInfo.location",
          type: "$donationInfo.type",
          quantity: "$donationInfo.quantity",
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get received pickups for charity
async function getReceivedPickups(req, res) {
  try {
    const { email } = req.query;
    const result = await DonationRequest.aggregate([
      { $match: { charityEmail: email, status: "PickedUp" } },
      { $addFields: { donationObjectId: { $toObjectId: "$donationId" } } },
      {
        $lookup: {
          from: "donations",
          localField: "donationObjectId",
          foreignField: "_id",
          as: "donationInfo",
        },
      },
      { $unwind: "$donationInfo" },
      {
        $project: {
          _id: 1,
          donationTitle: "$donationInfo.title",
          restaurantName: "$donationInfo.name",
          type: "$donationInfo.type",
          restaurantEmail: "$restaurantEmail",
          quantity: "$donationInfo.quantity",
          pickedUpAt: 1,
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllRequests,
  deleteRequestById,
  sendRequest,
  getRequestsByRestaurant,
  getRequestsByCharity,
  updateRequestStatus,
  deleteOwnRequest,
  confirmPickup,
  getAcceptedPickups,
  getReceivedPickups,
};