require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {connectMongoDb} = require("./connection")


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


// router ======================================
const userRouter = require("./routes/user")
const favoritesRouter = require("./routes/favorites")
const paymentRouter = require("./routes/payment");
const reviewRouter = require("./routes/review");





async function run() {
  try {
    
    app.use("/user",userRouter);
    app.use("/favorites",favoritesRouter);
    // after i want add /payment
    app.use("/", paymentRouter);
    app.use("/reviews", reviewRouter);














    





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