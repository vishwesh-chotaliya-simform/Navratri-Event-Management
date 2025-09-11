// Run this script with: node scripts/createAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/navratri_event";

async function createAdmin() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const username = "admin";
  const password = "admin123"; // Change as needed
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  const admin = new Admin({
    username,
    password: hashedPassword,
    role: "admin",
  });
  await admin.save();
  console.log("Admin created:", username);
  process.exit();
}

createAdmin();
