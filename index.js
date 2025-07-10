require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

async function run() {
  try {





    const db = client.db("foodDonationDb");
    const userCollation = db.collection("users");
    const paymentsCollection = db.collection("payments")
    const donationsCollection = db.collection("donations")

    // user collation api =================================

    // user data save api
    app.post("/user", async (req, res) => {
      const userData = req.body;
      const query = { email: userData.email }

      const findUser = await userCollation.findOne(query);
      if (findUser) {
        const userUpdata = await userCollation.updateOne(query, { $set: { last_login: new Date().toISOString() } });
        res.send(userUpdata)
        return 
      }
      

      const result = await userCollation.insertOne(userData);
      res.send(result);
    });

    //  updata user role and status
    
    app.patch("/updata-user-role", async (req, res) => {
      const updateData = req.body;
      const query = { email: updateData.email };
      if (updateData.newStatus === 'Approved') {
        const roleUpdate = await userCollation.updateOne(query, { $set: { role: updateData.role } });
        res.send(roleUpdate)
      }

      const result = await paymentsCollection.updateOne(query, { $set: { status: updateData.newStatus } });
      res.send(result)

    })


    // payment intent =================

    app.post("/create-payment-intent", async (req, res) => {
      const { amount } = req.body;
      console.log(amount);
        const paymentIntent = await stripe.paymentIntents.create({
          amount, // amount in cents: $10 = 1000
          currency:'usd',
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
        return
      }
      
      const result = await paymentsCollection.find().toArray();
      console.log("array",result);
      res.send(result)
    
    });
 
    // ==============================================

    // add donation 

    app.post('/add-donation', async (req, res) => {
      const donationData = req.body;
      const result = await donationsCollection.insertOne(donationData);
      res.send(result)
    })

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
      const result = await donationsCollection.deleteOne({_id:new ObjectId(id)});
      res.send(result)
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
      const result = await donationsCollection.updateOne({_id:new ObjectId(id)},{$set:donationData});
      res.send(result);
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
