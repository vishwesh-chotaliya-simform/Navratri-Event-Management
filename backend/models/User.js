const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  passQRCode: { type: String },
  createdAt: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  password: { type: String },
});

// Compound unique index for email + event
userSchema.index({ email: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
