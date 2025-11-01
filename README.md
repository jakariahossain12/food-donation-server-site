
# 🍽️ Food Donation Platform - Backend


This is the backend for a full-stack food donation platform that connects restaurants, charities, and users to reduce food waste and support communities. Built with **Node.js**, **Express**, **MongoDB**, **Firebase**, **Stripe**, and **JWT**, it supports secure authentication, role-based access, donation management, and real-time analytics.

---

## 🚀 Features

### 🔐 Authentication
- Email/password registration and login via Firebase
- Google social login
- JWT-based session management
- Role-based access control: User, Charity, Restaurant, Admin

### 🧑‍💼 User Role
- View and edit profile
- Request Charity role (with Stripe payment)
- Save donations to favorites
- Submit and manage reviews
- View transaction history

### 🏪 Restaurant Role
- Add and manage donations
- View and respond to charity requests
- Track donation statistics (Recharts-ready)

### 🧑‍🤝‍🧑 Charity Role
- Request donations
- Confirm pickups
- Submit reviews
- View received donations and transaction history

### 🛡️ Admin Role
- Manage donations, users, role requests, and charity requests
- Feature verified donations for homepage
- Assign roles without payment

---

## 🧰 Tech Stack

| Layer        | Tech Used                          |
|--------------|------------------------------------|
| Server       | Node.js, Express                   |
| Database     | MongoDB (Mongoose)                 |
| Auth         | Firebase Auth + JWT                |
| Payments     | Stripe Checkout / Elements         |
| File Uploads | Firebase Storage / Cloudinary      |
| Charts       | Recharts (frontend)                |
| API Client   | Axios with interceptors            |
| Data Fetching| Tanstack Query (frontend)          |

---


---

## 🔑 Environment Variables

Create a `.env` file in the backend root:

```env
MONGO_DB_URL="your_mongo_connection_string"
MONGO_DB_URL_M="your_mongo_connection_with_db"
STRIPE_SECRET_KEY="your_stripe_secret_key"
JWT_SECRET="your_jwt_secret"
FB_SERVICE_KEY="your_firebase_service_account_json_string"

---
And add = firebaseServiceAccount.json file

🛡️ Security
- JWT stored in localStorage for frontend access
- Axios interceptor handles 401 errors and token refresh
- Role-based route protection on both frontend and backend



