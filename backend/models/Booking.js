const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  name: { type: String, required: true }, // Add this
  phone: { type: String, required: true }, // Add this
  numTickets: { type: Number, required: true, default: 1 },
  passQRCode: { type: String },
  isCheckedIn: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },

  // Payment metadata (optional)
  orderId: { type: String }, // razorpay order id
  paymentId: { type: String }, // razorpay payment id
  amountPaid: { type: Number }, // amount in paisa
});

module.exports = mongoose.model("Booking", bookingSchema);
