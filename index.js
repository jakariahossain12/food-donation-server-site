require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// firebase admin
var admin = require("firebase-admin");

var serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const { MongoClient, ServerApiVersion, ObjectId, Admin } = require("mongodb");
const { default: Stripe } = require("stripe");
const uri = process.env.MONGO_DB_URL;
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// token verity

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  if (!token) return res.status(401).send({ message: "UnAuthorized" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    res.user = decoded;
    next();
  } catch (error) {
    return res.status(403).send({ message: "invalid token" });
  }
};

async function run() {
  try {
    const db = client.db("foodDonationDb");
    const userCollation = db.collection("users");
    const paymentsCollection = db.collection("payments");
    const donationsCollection = db.collection("donations");
    const favoritesCollection = db.collection("favorites");
    const donationRequestsCollection = db.collection("requests");
    const donationReviewCollection = db.collection("review");

    // user collation api =================================

    // user data save api
    app.post("/user", async (req, res) => {
      const userData = req.body;
      const query = { email: userData.email };

      const findUser = await userCollation.findOne(query);
      if (findUser) {
        const userUpdata = await userCollation.updateOne(query, {
          $set: { last_login: new Date().toISOString() },
        });
        res.send(userUpdata);
        return;
      }

      const result = await userCollation.insertOne(userData);
      res.send(result);
    });

    // user for user
    app.get("/user", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };

      const result = await userCollation.findOne(query);
      res.send(result);
    });

    // admin api ===============================================

    // get all user for admin

    app.get("/all-user", async (req, res) => {
      const result = await userCollation.find().toArray();
      res.send(result);
    });

    // updata user role by admin

    app.patch("/user", async (req, res) => {
      const updateData = req.body;
      console.log(updateData);
      const result = await userCollation.updateOne(
        { _id: new ObjectId(updateData.id) },
        { $set: { role: updateData.value } }
      );
      res.send(result);
    });

    // user delete admin

    app.delete("/user", async (req, res) => {
      const id = req.query.id;
      const result = await userCollation.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    //  updata user role and status admin

    app.patch("/updata-user-role", async (req, res) => {
      const updateData = req.body;
      const query = { email: updateData.email };
      if (updateData.newStatus === "Approved") {
        const roleUpdate = await userCollation.updateOne(query, {
          $set: { role: updateData.role },
        });
        res.send(roleUpdate);
      }

      const result = await paymentsCollection.updateOne(query, {
        $set: { status: updateData.newStatus },
      });
      res.send(result);
    });

    // get all donation for admin

    app.get("/all-donations", async (req, res) => {
      console.log(req.decoded);
      const result = await donationsCollection.find().toArray();

      res.send(result);
    });

    // donation verify by admin

    app.patch("/update-donation-status/:id", async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;
      const result = await donationsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: status } }
      );
      res.send(result);
    });

    // get all donation requests for admin

    app.get("/donation-requests", async (req, res) => {
      const result = await donationRequestsCollection.find().toArray();
      res.send(result);
    });

    // delete donation requests for admin
    app.delete("/donation-request/:id", async (req, res) => {
      const id = req.params.id;
      const result = await donationRequestsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // GET all verified donations for admin
    app.get("/donations/verified", async (req, res) => {
      const result = await donationsCollection
        .find({ status: "Verified" })
        .toArray();
      res.send(result);
    });

    //  =========================================

    // payment intent =================

    app.post("/create-payment-intent", async (req, res) => {
      const { amount } = req.body;
      console.log(amount);
      const paymentIntent = await stripe.paymentIntents.create({
        amount, // amount in cents: $10 = 1000
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    // save payment data

    app.post("/save-payment", async (req, res) => {
      const paymentData = req.body;
      const result = await paymentsCollection.insertOne(paymentData);
      res.send({
        message: "Payment saved successfully",
        id: result.insertedId,
      });
    });

    // get find data payment already exist

    app.get("/charity-request-status", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
        const result = await paymentsCollection.findOne(query);
        res.send(result);
        return;
      }

      const result = await paymentsCollection.find().toArray();
      console.log("array", result);
      res.send(result);
    });

    // ==============================================

    // add donation

    app.post("/add-donation", async (req, res) => {
      const donationData = req.body;
      const result = await donationsCollection.insertOne(donationData);
      res.send(result);
    });

    // this not admin all verify donation get for user

    app.get("/all-verify-donations", async (req, res) => {
      const limit = parseInt(req.query.limit) || 2;
      const result = await donationsCollection
        .find({ status: "Verified" })

        .sort({ create: -1 })
        .toArray();
      res.send(result);
    });

    //  get all my donation

    app.get("/my-donation", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      console.log(query);
      const result = await donationsCollection.find(query).toArray();
      res.send(result);
    });

    // delete my donation

    app.delete("/delete-donation", async (req, res) => {
      const id = req.query.id;
      const result = await donationsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    // get one donation
    app.get("/donation", async (req, res) => {
      const id = req.query.id;
      const result = await donationsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // update donation

    app.put("/update-donation/:id", async (req, res) => {
      const donationData = req.body;
      const id = req.params.id;
      const result = await donationsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: donationData }
      );
      res.send(result);
    });

    // featured donations ====================================

    // GET only featured donations (minimum 0, max 4)
    app.get("/featured-donations", async (req, res) => {
      try {
        const limit = 4;

        const featured = await donationsCollection
          .find({ status: "Verified" })
          .sort({ create: -1 })
          .limit(limit)
          .toArray();

        res.send(featured); // sends 0-4 donations
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to fetch featured donations", error });
      }
    });

    // Get latest charity requests (limit default to 3)
    app.get("/charity-requests/latest", async (req, res) => {
      

      try {
        const result = await paymentsCollection
          .find({}) // Optional: add filter like { status: 'Pending' }
          .sort({ created: -1 })
          .limit(3)
          .toArray();

        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to fetch latest charity requests", error });
      }
    });

    //favorites donation save =====================

    app.post("/favorites", async (req, res) => {
      const { donationId, userEmail } = req.body;

      // Check if already saved
      const exists = await favoritesCollection.findOne({
        donationId: new ObjectId(donationId),
        userEmail,
      });
      if (exists) {
        return res.status(409).send({ message: "Already saved." });
      }

      const result = await favoritesCollection.insertOne({
        ...req.body,
        donationId: new ObjectId(donationId),
      });
      res.send(result);
    });

    // get favorites donation

    app.get("/favorites", async (req, res) => {
      const email = req.query.email;

      const query = { userEmail: email };
      console.log(query);

      const fov = await favoritesCollection.findOne(query);
      console.log(fov);

      const result = await favoritesCollection
        .aggregate([
          {
            $match: query,
          },
          {
            $lookup: {
              from: "donations",
              localField: "donationId",
              foreignField: "_id",
              as: "donationInfo",
            },
          },
          {
            $unwind: "$donationInfo",
          },
          {
            $project: {
              _id: 1,
              donationId: "$donationInfo._id",
              title: "$donationInfo.title",
              image: "$donationInfo.image",
              name: "$donationInfo.name",
              location: "$donationInfo.location",
              status: "$donationInfo.status",
              quantity: "$donationInfo.quantity",
            },
          },
        ])
        .toArray();

      console.log(result);

      res.send(result);
    });

    // DELETE /favorites/:id
    app.delete("/favorites/:id", async (req, res) => {
      const id = req.params.id;
      const result = await favoritesCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // donation request send

    app.post("/donation-request", async (req, res) => {
      const { charityEmail, donationId } = req.body;
      // Check if already request
      const exists = await donationRequestsCollection.findOne({
        donationId,
        charityEmail,
      });
      if (exists) {
        return res.status(409).send({ message: "Already requests." });
      }

      const result = await donationRequestsCollection.insertOne({
        ...req.body,
      });
      res.send(result);
    });

    // GET /donation-requests for restaurant
    app.get("/donation-requests", async (req, res) => {
      const email = req.query.email; // optional filter by restaurant email
      const query = { restaurantEmail: email };
      const result = await donationRequestsCollection.find(query).toArray();
      res.send(result);
    });

    // GET /donation-requests for my-requests charity
    app.get("/my-requests", async (req, res) => {
      const email = req.query.email; // optional filter by restaurant email
      const query = { charityEmail: email };
      const result = await donationRequestsCollection.find(query).toArray();
      res.send(result);
    });

    // donation-requests update
    app.patch("/donation-requests/:id", async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      const query = {
        _id: new ObjectId(id),
      };

      // 1. Get the accepted request
      const request = await donationRequestsCollection.findOne(query);

      if (!request) {
        return res.status(404).send({ message: "Request not found" });
      }

      if (status === "Accepted") {
        const updateDog = {
          $set: {
            status,
            pickup_status: "Assigned",
          },
        };

        // 2. Update the selected request status
        await donationRequestsCollection.updateOne(query, updateDog);
      } else {
        // 2. Update the selected request status
        await donationRequestsCollection.updateOne(query, { $set: { status } });
      }

      // 3. If accepted, reject others for same donation
      if (status === "Accepted") {
        await donationRequestsCollection.updateMany(
          {
            donationId: request.donationId,
            _id: { $ne: new ObjectId(id) },
          },
          {
            $set: { status: "Rejected" },
          }
        );
      }

      res.send({ success: true });
    });

    // donation-requests delete
    app.delete("/donation-requests/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };

      const result = await donationRequestsCollection.deleteOne(query);
      res.send(result);
    });

    // GET all Accepted donation request for a charity =======================

    app.get("/donation-request/pickups", async (req, res) => {
      const email = req.query.email;

      const query = {
        charityEmail: email,
        status: "Accepted",
      };

      console.log("pickup query", query);

      // Check if any document matches
      const fov = await donationRequestsCollection.findOne(query);
      console.log("sample match:", fov);

      const result = await donationRequestsCollection
        .aggregate([
          { $match: query },
          {
            // Convert donationId string to ObjectId
            $addFields: {
              donationObjectId: { $toObjectId: "$donationId" },
            },
          },
          {
            $lookup: {
              from: "donations",
              localField: "donationObjectId",
              foreignField: "_id",
              as: "donationInfo",
            },
          },
          { $unwind: "$donationInfo" },
          {
            $project: {
              _id: 1,
              donationTitle: 1,
              restaurantName: 1,
              pickupTime: 1,
              status: 1,
              location: "$donationInfo.location",
              type: "$donationInfo.type",
              quantity: "$donationInfo.quantity",
            },
          },
        ])
        .toArray();

      console.log("pickup result", result);
      res.send(result);
    });

    //  donation requests status updata also donation status

    app.patch("/donation-request/pickup/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const filter = { _id: new ObjectId(id) };
        const requestsDonation = await donationRequestsCollection.findOne(
          filter
        );
        const donationId = requestsDonation.donationId;
        const query = { _id: new ObjectId(donationId) };
        const updateDoc = {
          $set: {
            status: "PickedUp",
            pickedUpAt: new Date().toISOString(), // Optional: timestamp for logging
          },
        };

        const donationUpdata = await donationsCollection.updateOne(
          query,
          updateDoc
        );
        const result = await donationRequestsCollection.updateOne(
          filter,
          updateDoc
        );

        if (result.modifiedCount > 0) {
          res.send({ success: true, message: "Pickup confirmed." });
        } else {
          res.status(404).send({
            success: false,
            message: "Request not found or already updated.",
          });
        }
      } catch (error) {
        console.error("Error confirming pickup:", error);
        res.status(500).send({
          success: false,
          message: "Server error while confirming pickup.",
        });
      }
    });

    // get all pickups donation

    app.get("/donation-request/received", async (req, res) => {
      const email = req.query.email;
      const result = await donationRequestsCollection
        .aggregate([
          {
            $match: {
              charityEmail: email,
              status: "PickedUp",
            },
          },
          {
            $addFields: {
              donationObjectId: { $toObjectId: "$donationId" },
            },
          },
          {
            $lookup: {
              from: "donations",
              localField: "donationObjectId",
              foreignField: "_id",
              as: "donationInfo",
            },
          },
          {
            $unwind: "$donationInfo",
          },
          {
            $project: {
              _id: 1,
              donationTitle: "$donationInfo.title",
              restaurantName: "$donationInfo.name",
              type: "$donationInfo.type",
              restaurantEmail: "$restaurantEmail",
              quantity: "$donationInfo.quantity",
              pickedUpAt: "1", // Optional: ensure you update `updatedAt` when status changes
            },
          },
        ])
        .toArray();

      res.send(result);
    });

    // add review in donation

    app.post("/donation-review", async (req, res) => {
      const review = req.body;
      const result = await donationReviewCollection.insertOne(review);
      res.send(result);
    });

    // get review in donation

    app.get("/review", async (req, res) => {
      const donationId = req.query.id;
      const result = await donationReviewCollection
        .find({
          donationId,
        })
        .toArray();
      res.send(result);
    });

// get user reviews =====
    app.get("/reviews/:id", async (req, res) => {
      const restaurantEmail = req.params.id;
      const result = await donationReviewCollection
        .find({
          restaurantEmail,
        })
        .toArray();
      res.send(result);
    });
// delete my reviews
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const result = await donationReviewCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });




    // firebase user delete

    app.delete("/delete-user/:uid", async (req, res) => {
      try {
        const uid = req.params.uid;
        console.log(uid);
        await admin.auth().deleteUser(uid);
        res.status(200).json({ message: "User deleted successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete user" });
      }
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
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
