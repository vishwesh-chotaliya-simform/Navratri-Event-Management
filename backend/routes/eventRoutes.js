const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/role");

// Create event (admin/superadmin only)
router.post(
  "/",
  auth,
  requireRole(["admin", "superadmin"]),
  eventController.createEvent
);

// List all events
router.get("/", eventController.listEvents);

// Update event (admin/superadmin only)
router.put(
  "/:id",
  auth,
  requireRole(["admin", "superadmin"]),
  eventController.updateEvent
);

// Delete event (admin/superadmin only)
router.delete(
  "/:id",
  auth,
  requireRole(["admin", "superadmin"]),
  eventController.deleteEvent
);

module.exports = router;
