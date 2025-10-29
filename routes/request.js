const express = require("express");
const router = express.Router();
const {
  verifyToken,
  adminVerify,
  charityVerify,
  restaurantVerify,
} = require("../middlewares/index");

const {
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
} = require("../controllers/request");

// General or admin: Get all donation requests
router.get("/", verifyToken, getAllRequests);

// Admin: Delete a request
router.delete("/:id", verifyToken, adminVerify, deleteRequestById);

// Charity: Send a donation request
router.post("/", verifyToken, charityVerify, sendRequest);

// Restaurant: Get requests by restaurant email
router.get("/restaurant", verifyToken, restaurantVerify, getRequestsByRestaurant);

// Charity: Get own requests
router.get("/my-requests", verifyToken, charityVerify, getRequestsByCharity);

// Restaurant: Update request status
router.patch("/:id", verifyToken, restaurantVerify, updateRequestStatus);

// delete own request
router.delete("/:id", verifyToken, deleteOwnRequest);

// Charity: Confirm pickup
router.patch("/pickup/:id", verifyToken, charityVerify, confirmPickup);

// Charity: Get accepted pickups
router.get("/pickups", verifyToken, charityVerify, getAcceptedPickups);

// Charity: Get received pickups
router.get("/received", verifyToken, charityVerify, getReceivedPickups);

module.exports = router;