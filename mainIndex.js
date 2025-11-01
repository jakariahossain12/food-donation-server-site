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
    // after i want add /payment
    app.use("/payment", paymentRouter);
    app.use("/reviews", reviewRouter);
    app.use("/donation-request", requestRouter);
    app.use("/donation-requests", requestRouter);
    app.use("/donation", donationRouter);
    app.use("/user-stats", userStatsRouter);
    app.use("/auth", authRouter);
    app.use("/firebase-user", firebaseUserRouter);







    
        // User Overview Stats
        // app.get("/user-stats/:email", async (req, res) => {
        //   const email = req.params.email;
        //   console.log(email);
        //   try {
        //     const user = await userCollation.findOne({ email });
    
        //     if (user.role === "restaurant") {
        //       const donationsPosted = await donationsCollection.countDocuments({
        //         email: email,
        //       });
        //       const requestsReceived =
        //         await donationRequestsCollection.countDocuments({
        //           restaurantEmail: email,
        //         });
        //       const donationsCompleted =
        //         await donationRequestsCollection.countDocuments({
        //           restaurantEmail: email,
        //           status: "PickedUp",
        //         });
              
        //       console.log(donationsPosted, requestsReceived, donationsCompleted);
    
        //       return res.send({
        //         donationsPosted,
        //         requestsReceived,
        //         donationsCompleted,
        //       });
        //     }
    
        //     if (user.role === "charity") {
        //       const requestsMade = await donationRequestsCollection.countDocuments({
        //         charityEmail: email,
        //       });
        //       const approvedRequests =
        //         await donationRequestsCollection.countDocuments({
        //           charityEmail: email,
        //           status: "PickedUp",
        //         });
              
        //       console.log(requestsMade, approvedRequests);
    
        //       return res.send({ requestsMade, approvedRequests });
        //     }
    
        //     if (user.role === "admin") {
        //      const usersCount = await userCollation.countDocuments();
        //      const donationsCount = await donationsCollection.countDocuments();
        //      const requestsCount =
        //        await donationRequestsCollection.countDocuments();
        //      const successfulDonations = await paymentsCollection.countDocuments({
        //        status: "Approved",
        //      });
    
        //      console.log(
        //        usersCount,
        //        donationsCount,
        //        requestsCount,
        //        successfulDonations
        //      );
    
        //      res.send({
        //        usersCount,
        //        donationsCount,
        //        requestsCount,
        //        successfulDonations,
        //      });
        //     }
    
    
    
    
    
            
        //   } catch (err) {
        //     res.status(500).send({ error: err.message });
        //   }
        // });
    
        
    
        // // JWT TOKEN CREATE =============
        // app.post("/jwt-token", async (req, res) => {
        //   const email = req.body;
    
        //   const token = jwt.sign(email, process.env.JWT_SECRET, {
        //     expiresIn: "4h",
        //   });
    
        //   res.send({ token: token });
        // });
    
        // // user collation api =================================
    
        // app.get("/firebase-check", async (req, res) => {
        //   try {
        //     // Try accessing Firebase project info
        //     const projectInfo = await admin.app().options.projectId;
    
        //     res.status(200).send({
        //       success: true,
        //       message: "Firebase Admin SDK connected ✅",
        //       projectId: projectInfo,
        //     });
        //   } catch (error) {
        //     res.status(500).send({
        //       success: false,
        //       message: "Firebase Admin connection failed ❌",
        //       error: error.message,
        //     });
        //   }
        // });
    
      
       
    
        // admin api ===============================================
    
        
    
        //! get all donation for admin
    
        // app.get("/all-donations", verifyToken, async (req, res) => {
        //   const result = await donationsCollection.find().toArray();
    
        //   res.send(result);
        // });
    
        // // donation verify by admin
    
        // app.patch("/update-donation-status/:id",verifyToken,adminVerify,
        //   async (req, res) => {
        //     const { id } = req.params;
        //     const { status } = req.body;
        //     const result = await donationsCollection.updateOne(
        //       { _id: new ObjectId(id) },
        //       { $set: { status: status } }
        //     );
        //     res.send(result);
        //   }
        // );
    

    
        // // GET all verified donations for admin
        // app.get("/donations/verified", verifyToken, async (req, res) => {
        //   const result = await donationsCollection
        //     .find({ status: "Verified" })
        //     .toArray();
        //   res.send(result);
        // });
    
    
        // // //! ==============================================
    
        // // add donation
    
        // app.post("/add-donation", verifyToken, async (req, res) => {
        //   const donationData = req.body;
        //   const result = await donationsCollection.insertOne(donationData);
        //   res.send(result);
        // });
    
        // // this not admin all verify donation get for user
    
        // app.get("/all-verify-donations", async (req, res) => {
        //   const search = req.query.search || "";
    
        //   const filter = {
        //     status: "Verified",
        //     ...(search && {
        //       location: { $regex: search, $options: "i" }, // case-insensitive location search
        //     }),
        //   };
    
        //   try {
        //     const result = await donationsCollection
        //       .find(filter)
        //       .sort({ create: -1 }) // newest first
        //       .toArray();
    
        //     res.send(result);
        //   } catch (error) {
        //     console.error("Failed to fetch verified donations:", error);
        //     res.status(500).send({ error: "Server error" });
        //   }
        // });
    
        // //  get all my donation
    
        // app.get("/my-donation", verifyToken, restaurantVerify, async (req, res) => {
        //   const email = req.query.email;
        //   const query = { email: email };
        //   const result = await donationsCollection.find(query).toArray();
        //   res.send(result);
        // });
    
        // // delete my donation
    
        // app.delete("/delete-donation",verifyToken,restaurantVerify,
        //   async (req, res) => {
        //     const id = req.query.id;
        //     const result = await donationsCollection.deleteOne({
        //       _id: new ObjectId(id),
        //     });
        //     res.send(result);
        //   }
        // );
        // // get one donation
        // app.get("/donation", async (req, res) => {
        //   const id = req.query.id;
        //   const result = await donationsCollection.findOne({
        //     _id: new ObjectId(id),
        //   });
        //   res.send(result);
        // });
    
        // // update donation
    
        // app.put("/update-donation/:id",verifyToken,restaurantVerify,
        //   async (req, res) => {
        //     const donationData = req.body;
        //     const id = req.params.id;
        //     const result = await donationsCollection.updateOne(
        //       { _id: new ObjectId(id) },
        //       { $set: donationData }
        //     );
        //     res.send(result);
        //   }
        // );
    
        // // Donation Statistics eita alada
        // app.get("/restaurant/donation-stats", verifyToken, async (req, res) => {
        //   const email = req.user.email;
    
        //   const pipeline = [
        //     { $match: { email, status: "Verified" } },
        //     {
        //       $group: {
        //         _id: "$type",
        //         quantity: { $sum: { $toInt: "$quantity" } },
        //       },
        //     },
        //     {
        //       $project: {
        //         _id: 0,
        //         type: "$_id",
        //         quantity: 1,
        //       },
        //     },
        //   ];
    
        //   const result = await donationsCollection.aggregate(pipeline).toArray();
        //   res.send(result);
        // });
    
        // // featured donations ====================================
    
        // app.patch("/donations/feature/:id",verifyToken,adminVerify,
        //   async (req, res) => {
        //     const id = req.params.id;
        //     const result = await donationsCollection.updateOne(
        //       { _id: new ObjectId(id) },
        //       { $set: { featured: true } }
        //     );
        //     res.send(result);
        //   }
        // );
    
        // // GET only featured donations (minimum 0, max 4)
        // app.get("/featured-donations", async (req, res) => {
        //   try {
        //     const featured = await donationsCollection
        //       .find({ featured: true })
        //       .sort({ create: -1 })
        //       .toArray();
    
        //     res.send(featured); // sends 0-4 donations
        //   } catch (error) {
        //     res
        //       .status(500)
        //       .send({ message: "Failed to fetch featured donations", error });
        //   }
        // });
    
       
       
    

        //!   // get all donation requests for admin move completed
    
        // app.get("/donation-requests", verifyToken, async (req, res) => {
        //   const result = await donationRequestsCollection.find().toArray();
        //   res.send(result);
        // });
    
        // // delete donation requests for admin
        // app.delete("/donation-request/:id",verifyToken,adminVerify,
        //   async (req, res) => {
        //     const id = req.params.id;
        //     const result = await donationRequestsCollection.deleteOne({
        //       _id: new ObjectId(id),
        //     });
        //     res.send(result);
        //   }
        // );
        // // donation request send
    
        // app.post("/donation-request",verifyToken,charityVerify,
        //   async (req, res) => {
        //     const { charityEmail, donationId } = req.body;
        //     // Check if already request
        //     const exists = await donationRequestsCollection.findOne({
        //       donationId,
        //       charityEmail,
        //     });
        //     if (exists) {
        //       return res.status(409).send({ message: "Already requests." });
        //     }
    
        //     const result = await donationRequestsCollection.insertOne({
        //       ...req.body,
        //     });
        //     res.send(result);
        //   }
        // );
    
        // // GET /donation-requests for restaurant
        // app.get("/donation-requests", verifyToken, async (req, res) => {
        //   const email = req.query.email; // optional filter by restaurant email
        //   const query = { restaurantEmail: email };
        //   const result = await donationRequestsCollection
        //     .find(query)
        //     .sort({ requestedAt: -1 })
        //     .toArray();
        //   res.send(result);
        // });
    
        // // GET /donation-requests for my-requests charity
        // app.get("/my-requests", verifyToken, async (req, res) => {
        //   const email = req.query.email; // optional filter by restaurant email
        //   const query = { charityEmail: email };
        //   const result = await donationRequestsCollection.find(query).toArray();
        //   res.send(result);
        // });
    
        // // donation-requests update
        // app.patch("/donation-requests/:id",verifyToken,restaurantVerify,async (req, res) => {
        //     const id = req.params.id;
        //     const { status } = req.body;
        //     const query = {
        //       _id: new ObjectId(id),
        //     };
    
        //     // 1. Get the accepted request
        //     const request = await donationRequestsCollection.findOne(query);
    
        //     if (!request) {
        //       return res.status(404).send({ message: "Request not found" });
        //     }
    
        //     if (status === "Accepted") {
        //       const updateDog = {
        //         $set: {
        //           status,
        //           pickup_status: "Assigned",
        //         },
        //       };
    
        //       // 2. Update the selected request status
        //       await donationRequestsCollection.updateOne(query, updateDog);
        //     } else {
        //       // 2. Update the selected request status
        //       await donationRequestsCollection.updateOne(query, {
        //         $set: { status },
        //       });
        //     }
    
        //     // 3. If accepted, reject others for same donation
        //     if (status === "Accepted") {
        //       await donationRequestsCollection.updateMany(
        //         {
        //           donationId: request.donationId,
        //           _id: { $ne: new ObjectId(id) },
        //         },
        //         {
        //           $set: { status: "Rejected" },
        //         }
        //       );
        //     }
    
        //     res.send({ success: true });
        //   }
        // );
    
        // // donation-requests delete
        // app.delete("/donation-requests/:id", verifyToken, async (req, res) => {
        //   const id = req.params.id;
        //   const query = {
        //     _id: new ObjectId(id),
        //   };
    
        //   const result = await donationRequestsCollection.deleteOne(query);
        //   res.send(result);
        // });
    
        // //! GET all Accepted donation request for a charity =======================
    
        // app.get("/donation-request/pickups", verifyToken, async (req, res) => {
        //   const email = req.query.email;
    
        //   const query = {
        //     charityEmail: email,
        //     status: "Accepted",
        //   };
    
        //   // Check if any document matches
        //   const fov = await donationRequestsCollection.findOne(query);
    
        //   const result = await donationRequestsCollection
        //     .aggregate([
        //       { $match: query },
        //       {
        //         // Convert donationId string to ObjectId
        //         $addFields: {
        //           donationObjectId: { $toObjectId: "$donationId" },
        //         },
        //       },
        //       {
        //         $lookup: {
        //           from: "donations",
        //           localField: "donationObjectId",
        //           foreignField: "_id",
        //           as: "donationInfo",
        //         },
        //       },
        //       { $unwind: "$donationInfo" },
        //       {
        //         $project: {
        //           _id: 1,
        //           donationTitle: 1,
        //           restaurantName: 1,
        //           pickupTime: 1,
        //           status: 1,
        //           location: "$donationInfo.location",
        //           type: "$donationInfo.type",
        //           quantity: "$donationInfo.quantity",
        //         },
        //       },
        //     ])
        //     .toArray();
    
        //   res.send(result);
        // });
    
        // //  donation requests status updata also donation status
    
        // app.patch("/donation-request/pickup/:id", verifyToken, async (req, res) => {
        //   const id = req.params.id;
    
        //   try {
        //     const filter = { _id: new ObjectId(id) };
        //     const requestsDonation = await donationRequestsCollection.findOne(
        //       filter
        //     );
        //     const donationId = requestsDonation.donationId;
        //     const query = { _id: new ObjectId(donationId) };
        //     const updateDoc = {
        //       $set: {
        //         status: "PickedUp",
        //         pickedUpAt: new Date().toISOString(), // Optional: timestamp for logging
        //       },
        //     };
    
        //     const donationUpdata = await donationsCollection.updateOne(
        //       query,
        //       updateDoc
        //     );
        //     const result = await donationRequestsCollection.updateOne(
        //       filter,
        //       updateDoc
        //     );
    
        //     if (result.modifiedCount > 0) {
        //       res.send({ success: true, message: "Pickup confirmed." });
        //     } else {
        //       res.status(404).send({
        //         success: false,
        //         message: "Request not found or already updated.",
        //       });
        //     }
        //   } catch (error) {
        //     console.error("Error confirming pickup:", error);
        //     res.status(500).send({
        //       success: false,
        //       message: "Server error while confirming pickup.",
        //     });
        //   }
        // });
    
        // // get all pickups donation
    
        // app.get("/donation-request/received", verifyToken, async (req, res) => {
        //   const email = req.query.email;
        //   const result = await donationRequestsCollection
        //     .aggregate([
        //       {
        //         $match: {
        //           charityEmail: email,
        //           status: "PickedUp",
        //         },
        //       },
        //       {
        //         $addFields: {
        //           donationObjectId: { $toObjectId: "$donationId" },
        //         },
        //       },
        //       {
        //         $lookup: {
        //           from: "donations",
        //           localField: "donationObjectId",
        //           foreignField: "_id",
        //           as: "donationInfo",
        //         },
        //       },
        //       {
        //         $unwind: "$donationInfo",
        //       },
        //       {
        //         $project: {
        //           _id: 1,
        //           donationTitle: "$donationInfo.title",
        //           restaurantName: "$donationInfo.name",
        //           type: "$donationInfo.type",
        //           restaurantEmail: "$restaurantEmail",
        //           quantity: "$donationInfo.quantity",
        //           pickedUpAt: "1", // Optional: ensure you update `updatedAt` when status changes
        //         },
        //       },
        //     ])
        //     .toArray();
    
        //   res.send(result);
        // });
    
      
    
        //! firebase user delete
    
        // app.delete("/delete-user/:uid",verifyToken,adminVerify,
        //   async (req, res) => {
        //     try {
        //       const uid = req.params.uid;
        //       await admin.auth().deleteUser(uid);
        //       res.status(200).json({ message: "User deleted successfully" });
        //     } catch (err) {
        //       console.error(err);
        //       res.status(500).json({ error: "Failed to delete user" });
        //     }
        //   }
        // );










    





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