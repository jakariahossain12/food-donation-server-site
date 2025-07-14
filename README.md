


# 🍽️ Food Donation Platform - Backend

This is the **Backend** for the Food Donation Platform. It provides APIs for donation management, user roles, requests, reviews, Stripe payment, and authentication.

## 🚀 Features

- 🔐 JWT Authentication & Firebase Token Verification
- 📊 Role-based authorization:
  - 🛡️ **Admin**: verify donations, manage users, feature donations, approve charities
  - 🧑‍🍳 **Restaurant**: add/manage donations
  - 🏥 **Charity**: request/pickup donations, leave reviews
- 📦 MongoDB for data storage
- 💳 Stripe integration for charity upgrade payments
- 🌍 Secure API access with middleware (verifyToken, verifyAdmin, etc.)

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Firebase Admin SDK
- Stripe Payments
- JWT Authentication

## 🔐 Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=
ACCESS_TOKEN_SECRET=
STRIPE_SECRET_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
