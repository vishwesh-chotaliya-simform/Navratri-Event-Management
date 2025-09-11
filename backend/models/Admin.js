const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
});

module.exports = mongoose.model("Admin", adminSchema);
