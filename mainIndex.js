require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {connectMongoDb} = require("./connection")
// router ======================================
const userRouter = require("./routes/user")
const favoritesRouter = require("./routes/favorites")

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
const jwt = require("jsonwebtoken");
// firebase admin
var admin = require("firebase-admin");

// const decodedKey = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString(
//   "utf8"
// );

try {
  const keyJsonString = Buffer.from(
    process.env.FB_SERVICE_KEY,
    "base64"
  ).toString("utf8");

  const serviceAccount = JSON.parse(keyJsonString);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  // console.log("✅ Firebase Admin Initialized");
} catch (error) {
  console.error("❌ Failed to parse Firebase Admin key:", error.message);
}

const { MongoClient, ServerApiVersion, ObjectId, Admin } = require("mongodb");
const { default: Stripe } = require("stripe");
 
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
connectMongoDb(process.env.MONGO_DB_URL_M)
.then(()=>console.log("mongodb connect"))
.catch((err)=>console.log("mongo",err))


// token verity

const verifyToken =async (req, res, next) => {
  
  const token = await req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user to request

    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden" });
  }
};

async function run() {
  try {
    
    app.use("/user",userRouter);
    app.use("/favorites",favoritesRouter);














    





    // Connect the client to the server	(optional starting in v4.7)
    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("Food Donation API is running");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));