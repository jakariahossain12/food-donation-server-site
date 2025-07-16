const fs = require("fs");

// Step 1: Read the Firebase service account JSON file
const key = fs.readFileSync("./firebaseServiceAccount.json", "utf8");

// Step 2: Convert it to Base64
const base64 = Buffer.from(key).toString("base64");

// Step 3: Remove whitespace (just in case)
const cleaned = base64.replace(/\s+/g, "");

// Step 4: Save to a file for .env usage
fs.writeFileSync("cleaned.txt", cleaned);

console.log("✅ Base64-encoded service account key saved to cleaned.txt");
console.log(cleaned);