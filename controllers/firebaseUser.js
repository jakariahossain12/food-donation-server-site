const admin = require("../config/firebaseAdmin");

// Delete Firebase user by UID (admin only)
async function deleteFirebaseUser(req, res) {
  try {
    const { uid } = req.params;

    if (!uid || typeof uid !== "string") {
      return res.status(400).json({ error: "Valid UID is required" });
    }

    await admin.auth().deleteUser(uid);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Firebase deletion error:", error);
    res.status(500).json({ error: "Failed to delete user", details: error.message });
  }
}

module.exports = {
  deleteFirebaseUser,
};