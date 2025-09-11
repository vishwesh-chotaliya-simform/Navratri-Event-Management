const Event = require("../models/Event");

// Create a new event (admin only)
exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, location } = req.body;
    const event = new Event({
      name,
      description,
      date,
      location,
      createdBy: req.admin.id,
    });
    await event.save();
    res.status(201).json({ message: "Event created", event });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// List all events
exports.listEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update an event (admin only)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated", event });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete an event (admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
