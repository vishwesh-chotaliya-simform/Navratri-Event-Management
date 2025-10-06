require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser"); // add if needed

const app = express();
app.use(cors());
// NOTE: keep express.json() for normal routes
app.use(express.json());

// Import controller for webhook
const userController = require("./controllers/userController");

// Raw webhook endpoint (Razorpay requires raw body for signature verification)
app.post(
  "/api/users/webhook",
  express.raw({ type: "application/json" }),
  userController.razorpayWebhook
);

// Mount other routes (these expect JSON parsing)
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const eventRoutes = require("./routes/eventRoutes");
app.use("/api/events", eventRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/navratri_event";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
