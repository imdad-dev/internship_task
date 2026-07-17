const Registration = require("../models/Registration");
const Event = require("../models/Event");

// @route  POST /api/registrations   (logged in users only)
// @desc   Register the current user for an event
exports.registerForEvent = async (req, res, next) => {
  try {
    const { eventId, fullName, email, phone, notes } = req.body;

    if (!eventId || !fullName || !email || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all required fields" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Check for an existing active registration for this user + event
    const existing = await Registration.findOne({
      user: req.user.id,
      event: eventId,
      status: "confirmed",
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    // Check capacity
    const confirmedCount = await Registration.countDocuments({
      event: eventId,
      status: "confirmed",
    });
    if (confirmedCount >= event.capacity) {
      return res.status(400).json({ success: false, message: "This event is fully booked" });
    }

    const registration = await Registration.create({
      user: req.user.id,
      event: eventId,
      fullName,
      email,
      phone,
      notes: notes || "",
      status: "confirmed",
    });

    res.status(201).json({ success: true, registration });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/registrations/my   (logged in users only)
// @desc   Get all registrations belonging to the current user
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate("event")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/registrations/:id   (owner only)
// @desc   Cancel a registration
exports.cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }

    if (registration.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "You can only cancel your own registration" });
    }

    registration.status = "cancelled";
    await registration.save();

    res.status(200).json({ success: true, message: "Registration cancelled successfully" });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/registrations/event/:eventId   (organizer only, must own the event)
// @desc   View all registrations for a specific event
exports.getEventRegistrations = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "You can only view registrations for your own events" });
    }

    const registrations = await Registration.find({
      event: req.params.eventId,
      status: "confirmed",
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};
