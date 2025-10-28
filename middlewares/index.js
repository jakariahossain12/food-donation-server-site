const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user"); //  user model

// 🔐 Verify JWT Token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    res.status(403).json({ message: "Forbidden", error: err.message });
  }
};

// 🛡️ Role-Based Access Middleware
const roleVerify = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const email = req.user?.email;
      if (!email) return res.status(401).json({ message: "Unauthorized" });

      const user = await User.findOne({ email });
      if (!user || user.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden access" });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
};

// 🎯 Specific Role Middleware
const adminVerify = roleVerify("admin");
const charityVerify = roleVerify("charity");
const restaurantVerify = roleVerify("restaurant");

module.exports = {
  verifyToken,
  adminVerify,
  charityVerify,
  restaurantVerify,
};