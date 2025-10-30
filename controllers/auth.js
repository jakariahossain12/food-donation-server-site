const jwt = require("jsonwebtoken");

// Generate JWT token
async function generateJwtToken(req, res) {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Token generation failed", details: error.message });
  }
}

module.exports = {
  generateJwtToken,
};