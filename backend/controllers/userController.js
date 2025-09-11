const User = require("../models/User");
const Event = require("../models/Event");
const QRCode = require("qrcode");
const { sendQRCodeMail } = require("../utils/sendMail");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, event } = req.body;
    // Check if user already registered for this event
    const existingUser = await User.findOne({ email, event });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "You have already registered for this event." });

    const user = new User({ name, email, phone, event });
    // Generate QR code
    const qrData = `PASS:${email}`;
    const qrCode = await QRCode.toDataURL(qrData);
    user.passQRCode = qrCode;
    await user.save();

    // Fetch event details
    const eventObj = await Event.findById(event);

    // Send QR code via email
    await sendQRCodeMail({
      to: email,
      subject: `Your Event Pass for ${eventObj.name}`,
      qrCode,
      event: eventObj,
    });

    res.status(201).json({
      message: "Registration successful. QR code sent to your email.",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Generate QR code for approved user
exports.generateQRCode = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.id });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Use existing QR code if present
    let qrCode = user.passQRCode;
    if (!qrCode) {
      const qrData = `PASS:${user.email}`;
      qrCode = await QRCode.toDataURL(qrData);
      user.passQRCode = qrCode;
      await user.save();
    }

    // Only return QR code for preview, do NOT send email
    res.json({ qrCode });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// List all users (admin only)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Check-in user (admin only)
exports.checkInUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isCheckedIn)
      return res.status(400).json({ message: "User already checked in" });

    user.isCheckedIn = true;
    await user.save();
    res.json({ message: "Check-in successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Send QR code to user (self-service)
exports.sendQRCodeToUser = async (req, res) => {
  try {
    const { email, eventId } = req.body;
    const user = await User.findOne({ email, event: eventId });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found for this event." });
    if (user.isCheckedIn)
      return res
        .status(400)
        .json({ message: "User already checked in for this event." });

    // Use existing QR code if present
    let qrCode = user.passQRCode;
    if (!qrCode) {
      const qrData = `PASS:${user.email}`;
      qrCode = await QRCode.toDataURL(qrData);
      user.passQRCode = qrCode;
      await user.save();
    }

    // Fetch event details
    const event = await Event.findById(user.event);

    // Send QR code via email
    await sendQRCodeMail({
      to: user.email,
      subject: `Your Event Pass for ${event.name}`,
      qrCode,
      event,
    });

    res.json({ message: "Ticket resent to your email address." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
