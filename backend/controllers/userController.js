const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const QRCode = require("qrcode");
const { sendQRCodeMail } = require("../utils/sendMail");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, event, numTickets } = req.body;
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, phone });
      await user.save();
    }
    // Create booking with form-entered name and phone
    const booking = new Booking({
      user: user._id,
      event,
      name, // Use form value
      phone, // Use form value
      numTickets,
    });
    await booking.save();

    // Generate QR code with booking info
    const qrData = JSON.stringify({
      bookingId: booking._id,
      email,
      event,
      numTickets,
      name, // Include name in QR
      phone, // Include phone in QR
    });
    const qrCode = await QRCode.toDataURL(qrData);

    booking.passQRCode = qrCode;
    await booking.save();

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
    const { qrData } = req.body; // qrData is the decoded QR code string
    let bookingInfo;
    try {
      bookingInfo = JSON.parse(qrData);
    } catch {
      return res.status(400).json({ message: "Invalid QR code format" });
    }
    const booking = await Booking.findById(bookingInfo.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.isCheckedIn)
      return res.status(400).json({ message: "Already checked in" });

    booking.isCheckedIn = true;
    await booking.save();
    res.json({ message: "Check-in successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Send QR code to user (self-service)
exports.sendQRCodeToUser = async (req, res) => {
  try {
    const { bookingId } = req.body;
    // Find booking by ID
    const booking = await Booking.findById(bookingId)
      .populate("user")
      .populate("event");
    if (!booking)
      return res.status(404).json({ message: "Booking not found." });

    if (booking.isCheckedIn)
      return res
        .status(400)
        .json({ message: "User already checked in for this event." });

    // Use existing QR code if present
    let qrCode = booking.passQRCode;
    if (!qrCode) {
      const qrData = JSON.stringify({
        bookingId: booking._id,
        email: booking.user.email,
        event: booking.event._id,
        numTickets: booking.numTickets,
      });
      qrCode = await QRCode.toDataURL(qrData);
      booking.passQRCode = qrCode;
      await booking.save();
    }

    // Send QR code via email
    await sendQRCodeMail({
      to: booking.user.email,
      subject: `Your Event Pass for ${booking.event.name}`,
      qrCode,
      event: booking.event,
    });

    res.json({ message: "Ticket resent to your email address." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// List all bookings (admin only)
exports.listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("event", "name date location");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// List bookings for logged-in user
exports.userBookings = async (req, res) => {
  try {
    const userId = req.admin.id;
    const bookings = await Booking.find({ user: userId }).populate(
      "event",
      "name date location"
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
