const admin = require("firebase-admin");

try {
  const keyJsonString = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString("utf8");
  const serviceAccount = JSON.parse(keyJsonString);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin Initialized");
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin:", error.message);
}

module.exports = admin;