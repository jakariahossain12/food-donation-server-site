const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/payment"); // Mongoose model

// Create Stripe payment intent
async function createPaymentIntent(req, res) {
  try {
    const { amount } = req.body;

    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: "Stripe error", details: error.message });
  }
}

// Save payment data to MongoDB
async function savePayment(req, res) {
  try {
    const paymentData = req.body;

    if (!paymentData.email || !paymentData.amount || !paymentData.transactionId) {
      return res.status(400).json({ error: "Missing required payment fields" });
    }

    const payment = new Payment(paymentData);
    const saved = await payment.save();

    res.status(201).json({ message: "Payment saved successfully", id: saved._id });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
}

// Get payment status by charity email
async function getCharityRequestStatus(req, res) {
  try {
    const email = req.query.email;

    if (email) {
      const result = await Payment.findOne({ email });
      return res.status(200).json(result || {});
    }

    const allPayments = await Payment.find();
    res.status(200).json(allPayments);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
}

module.exports = {
  createPaymentIntent,
  savePayment,
  getCharityRequestStatus,
};