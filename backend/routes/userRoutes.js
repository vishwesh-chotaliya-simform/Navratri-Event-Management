const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const requireRole = require("../middleware/role");
const userController = require("../controllers/userController");

// User registration
router.post("/register", auth, userController.registerUser);

// Generate QR code for approved user
router.get("/:id/qrcode", userController.generateQRCode);

// List all users
router.get("/", auth, userController.listUsers);

// Check-in user (admin only)
router.post(
  "/checkin",
  auth,
  requireRole(["admin", "superadmin"]),
  userController.checkInUser
);

// Public: Send QR code via email if user is approved and not checked in
router.post("/send-qrcode", userController.sendQRCodeToUser);

// Get all bookings (admin only)
router.get(
  "/bookings",
  auth,
  requireRole(["admin", "superadmin"]),
  userController.listBookings
);

// Get user's bookings
router.get("/my-bookings", auth, userController.userBookings);

module.exports = router;
