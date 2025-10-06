const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const QRCode = require("qrcode");
const { sendQRCodeMail } = require("../utils/sendMail");
const razorpay = require("../utils/razorpay");
const crypto = require("crypto");

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

// Send QR code to user (self-service) — now requires auth and enforces ownership/admin
exports.sendQRCodeToUser = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId)
      return res.status(400).json({ message: "bookingId required" });

    // Find booking and populate
    const booking = await Booking.findById(bookingId)
      .populate("user")
      .populate("event");
    if (!booking)
      return res.status(404).json({ message: "Booking not found." });

    // Check permissions: owner or admin
    const requesterId = req.admin?.id;
    const requesterRole = req.admin?.role || "";
    if (!requesterId)
      return res.status(401).json({ message: "Authentication required" });

    const isOwner =
      booking.user && booking.user._id.toString() === requesterId.toString();
    const isAdmin = requesterRole === "admin" || requesterRole === "superadmin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden: not booking owner" });
    }

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

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { eventId, numTickets = 1 } = req.body;
    if (!eventId) return res.status(400).json({ message: "eventId required" });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.price || typeof event.price !== "number" || event.price <= 0) {
      return res
        .status(400)
        .json({ message: "Event price not configured. Contact admin." });
    }

    const amount = Math.round(event.price * numTickets * 100); // paisa

    const options = {
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
      notes: {
        eventId: String(eventId),
        numTickets: String(numTickets),
        // include user info if available from token
        userId: req.admin?.id || "",
        userEmail: req.admin?.email || "",
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Order creation failed", error: err.message });
  }
};

// Verify Razorpay payment signature and create booking server-side
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ message: "Missing payment verification fields" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Fetch payment and order details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const notes = (order && order.notes) || {};
    const eventId = notes.eventId;
    const numTickets = Number(notes.numTickets) || 1;
    const userIdFromNotes = notes.userId || "";
    const userEmailFromNotes = notes.userEmail || payment.email || "";

    if (!eventId) {
      return res.status(400).json({
        message: "Order missing event metadata, cannot create booking",
      });
    }

    const eventObj = await Event.findById(eventId);
    if (!eventObj) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find or create user
    let user = null;
    if (userIdFromNotes) {
      user = await User.findById(userIdFromNotes);
    }
    if (!user && userEmailFromNotes) {
      user = await User.findOne({ email: userEmailFromNotes });
    }
    if (!user) {
      user = new User({
        name: payment.contact || "Attendee",
        email: userEmailFromNotes,
        phone: payment.contact || "",
      });
      await user.save();
    }

    // Idempotency: return existing booking if orderId already saved
    const existing = await Booking.findOne({ orderId: razorpay_order_id });
    if (existing) {
      return res.json({ message: "Booking already exists", booking: existing });
    }

    // Create booking with payment metadata
    const booking = new Booking({
      user: user._id,
      event: eventId,
      name: user.name || payment.contact || "Attendee",
      phone: user.phone || payment.contact || "",
      numTickets,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amountPaid: payment.amount,
    });
    await booking.save();

    // Generate QR and attach to booking
    const qrData = JSON.stringify({
      bookingId: booking._id,
      email: user.email,
      event: eventId,
      numTickets,
      name: booking.name,
      phone: booking.phone,
    });
    const qrCode = await QRCode.toDataURL(qrData);
    booking.passQRCode = qrCode;
    await booking.save();

    // Send QR code email
    await sendQRCodeMail({
      to: user.email,
      subject: `Your Event Pass for ${eventObj.name}`,
      qrCode,
      event: eventObj,
    });

    return res.json({
      message: "Payment verified and booking created",
      bookingId: booking._id,
    });
  } catch (err) {
    console.error("verifyPayment error:", err);
    return res
      .status(500)
      .json({ message: "Verification failed", error: err.message });
  }
};

// Razorpay webhook handler (for server-side reconciliation)
// Reference: exposed in [backend/index.js](backend/index.js)
exports.razorpayWebhook = async (req, res) => {
  try {
    // Use the webhook secret (set in Razorpay dashboard & backend env)
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body; // raw buffer (index.js will pass raw)
    const expected = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (signature !== expected) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const payload = JSON.parse(body.toString());
    const event = payload.event;

    // Handle payment captured
    if (event === "payment.captured" || event === "payment.authorized") {
      const payment = payload.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const amount = payment.amount; // in paisa

      // Fetch order to read notes we stored at createOrder
      let order;
      try {
        order = await razorpay.orders.fetch(orderId);
      } catch (err) {
        console.error("Failed to fetch order from Razorpay:", err.message);
      }

      const notes = (order && order.notes) || {};
      const eventId = notes.eventId;
      const numTickets = Number(notes.numTickets) || 1;
      const userId = notes.userId || "";
      const userEmail = notes.userEmail || payment.email || "";

      if (!eventId) {
        // cannot proceed without event
        console.warn("Webhook: missing eventId in order notes", orderId);
        return res.json({ message: "No event metadata, ignored" });
      }

      // Ensure event exists
      const eventObj = await Event.findById(eventId);
      if (!eventObj) {
        console.warn("Webhook: event not found for id", eventId);
        return res.json({ message: "Event not found, ignored" });
      }

      // Find or create user
      let user;
      if (userId) {
        user = await User.findById(userId);
      }
      if (!user && userEmail) {
        user = await User.findOne({ email: userEmail });
      }
      if (!user) {
        // create minimal user record
        user = new User({
          name: payment.contact || "Attendee",
          email: userEmail,
          phone: payment.contact || "",
        });
        await user.save();
      }

      // Idempotency: check if booking for this order/payment already exists
      const existing = await Booking.findOne({ orderId });
      if (existing) {
        return res.json({ message: "Booking already created" });
      }

      // Create booking
      const booking = new Booking({
        user: user._id,
        event: eventId,
        name: user.name || payment.contact || "Attendee",
        phone: user.phone || payment.contact || "",
        numTickets,
        orderId,
        paymentId,
        amountPaid: amount,
      });
      await booking.save();

      // Generate QR and attach
      const qrData = JSON.stringify({
        bookingId: booking._id,
        email: user.email,
        event: eventId,
        numTickets,
        name: booking.name,
        phone: booking.phone,
      });
      const qrCode = await QRCode.toDataURL(qrData);
      booking.passQRCode = qrCode;
      await booking.save();

      // Send mail
      await sendQRCodeMail({
        to: user.email,
        subject: `Your Event Pass for ${eventObj.name}`,
        qrCode,
        event: eventObj,
      });

      return res.json({ message: "Booking created from webhook" });
    }

    // For other events, just acknowledge
    return res.json({ message: "Ignored event", event });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res
      .status(500)
      .json({ message: "Webhook handling failed", error: err.message });
  }
};
