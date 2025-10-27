const express = require("express");

const router = express.Router();








  //favorites donation save =====================
    
        app.post("/favorites", verifyToken, async (req, res) => {
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
    
        app.get("/favorites", verifyToken, async (req, res) => {
          const email = req.query.email;
    
          const query = { userEmail: email };
    
          const fov = await favoritesCollection.findOne(query);
    
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
    
          res.send(result);
        });
    
        // DELETE /favorites/:id
        app.delete("/favorites/:id", verifyToken, async (req, res) => {
          const id = req.params.id;
          const result = await favoritesCollection.deleteOne({
            _id: new ObjectId(id),
          });
          res.send(result);
        });