require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {connectMongoDb} = require("./connection")
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


// const decodedKey = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString(
//   "utf8"
// );

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
connectMongoDb(process.env.MONGO_DB_URL_M)
.then(()=>console.log("mongodb connect"))
.catch((err)=>console.log("mongo",err))


// router ======================================
const userRouter = require("./routes/user")
const favoritesRouter = require("./routes/favorites")
const paymentRouter = require("./routes/payment");
const reviewRouter = require("./routes/review");
const requestRouter = require("./routes/request");
const donationRouter = require("./routes/donation");
const userStatsRouter = require("./routes/userStats");
const authRouter = require("./routes/auth");
const firebaseUserRouter = require("./routes/firebaseUser");

async function run() {
  try {
    
    app.use("/user",userRouter);
    app.use("/favorites",favoritesRouter);
    app.use("/payment", paymentRouter);
    app.use("/reviews", reviewRouter);
    app.use("/donation-request", requestRouter);
    app.use("/donation-requests", requestRouter);
    app.use("/donation", donationRouter);
    app.use("/user-stats", userStatsRouter);
    app.use("/auth", authRouter);
    app.use("/firebase-user", firebaseUserRouter);


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