const mongoose = require("mongoose");
const User = require("../models/user");
const Payment = require("../models/payment");

// user data get by user email
async function handelGetUserByEmail(req, res) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User retrieved successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}
//  user data save in mongodb 
async function handelSaveUserData(req, res) {
  try {
    const userData = req.body;
    const query = { email: userData.email };

    if (!userData.email) {
      return res.status(400).json({ error: 'Email is required in request body' });
    }

    const existingUser = await User.findOne(query);

    if (existingUser) {
      existingUser.last_login = new Date().toISOString();
      await existingUser.save();
      return res.status(200).json({ message: 'User login time updated', user: existingUser });
    }

    const newUser = new User(userData);
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'New user created', id: savedUser._id });

  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}


// Get all users (admin only)
async function getAllUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

// Update user role by ID
async function updateUserRole(req, res) {
  try {
    const { id, value } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await User.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { role: value } }
    );

    res.status(200).json({ message: "User role updated", result });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

// Delete user by ID
async function deleteUser(req, res) {
  try {
    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await User.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

// Update user role and payment status
async function updateUserRoleAndStatus(req, res) {
  try {
    const { email, role, newStatus } = req.body;

    if (!email || !newStatus) {
      return res.status(400).json({ error: "Email and newStatus are required" });
    }

    const query = { email };

    if (newStatus === "Approved" && role) {
      await User.updateOne(query, { $set: { role } });
    }

    const result = await Payment.updateOne(query, { $set: { status: newStatus } });

    res.status(200).json({ message: "User status updated", result });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}



module.exports={
    handelGetUserByEmail,
    handelSaveUserData,
    getAllUsers,
    updateUserRole,
    deleteUser,
    updateUserRoleAndStatus,
}