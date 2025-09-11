const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }, // remove unique: true
  phone: { type: String, required: true },
  passQRCode: { type: String },
  isCheckedIn: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
});

// Compound unique index for email + event
userSchema.index({ email: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
