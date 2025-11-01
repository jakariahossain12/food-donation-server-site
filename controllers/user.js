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

    res.status(200).json(user);
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
      return res.status(200).json(existingUser);
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

            // Step 1: Find the user by ID
    const user = await User.findById({ _id: new mongoose.Types.ObjectId(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

     const userEmail = user.email;

     if(value === "user"){
              //  Delete related payment records
    const paymentDeletion = await Payment.deleteMany({ email: userEmail });
     }

    const result = await User.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { role: value } }
    );

    res.status(200).json(result);
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
        // Step 1: Find the user by ID
    const user = await User.findById({ _id: new mongoose.Types.ObjectId(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

     const userEmail = user.email;


    const result = await User.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
        //  Delete related payment records
    const paymentDeletion = await Payment.deleteMany({ email: userEmail });


    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result);
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

    let roleUpdateResult;
    if (newStatus === "Approved" && role) {
      roleUpdateResult = await User.updateOne(query, { $set: { role } });
    }

    const statusUpdateResult = await Payment.updateOne(query, { $set: { status: newStatus } });

    return res.status(200).json({
      message: "User role and status updated",
      roleUpdate: roleUpdateResult,
      statusUpdate: statusUpdateResult,
    });

  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
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