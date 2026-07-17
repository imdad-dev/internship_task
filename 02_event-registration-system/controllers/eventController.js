const Event = require("../models/Event");
const Registration = require("../models/Registration");

// @route  GET /api/events
// @desc   Get all events (supports ?category= & ?search= query params)
exports.getAllEvents = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const events = await Event.find(filter)
      .populate("organizer", "name email")
      .sort({ date: 1 });

    // Attach confirmed registration count + seats left for each event
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const confirmedCount = await Registration.countDocuments({
          event: event._id,
          status: "confirmed",
        });
        const eventObj = event.toObject();
        eventObj.registeredCount = confirmedCount;
        eventObj.seatsLeft = event.capacity - confirmedCount;
        return eventObj;
      })
    );

    res.status(200).json({ success: true, count: eventsWithCounts.length, events: eventsWithCounts });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/events/:id
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name email"
    );

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const confirmedCount = await Registration.countDocuments({
      event: event._id,
      status: "confirmed",
    });

    const eventObj = event.toObject();
    eventObj.registeredCount = confirmedCount;
    eventObj.seatsLeft = event.capacity - confirmedCount;

    res.status(200).json({ success: true, event: eventObj });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/events   (organizer only)
exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, category, date, time, location, capacity } = req.body;

    if (!title || !description || !date || !time || !location || !capacity) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      capacity,
      organizer: req.user.id,
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/events/:id   (organizer only, must own the event)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only edit your own events" });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/events/:id   (organizer only, must own the event)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only delete your own events" });
    }

    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();

    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/events/organizer/mine   (organizer only)
exports.getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user.id }).sort({ date: 1 });

    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const confirmedCount = await Registration.countDocuments({
          event: event._id,
          status: "confirmed",
        });
        const eventObj = event.toObject();
        eventObj.registeredCount = confirmedCount;
        eventObj.seatsLeft = event.capacity - confirmedCount;
        return eventObj;
      })
    );

    res.status(200).json({ success: true, count: eventsWithCounts.length, events: eventsWithCounts });
  } catch (error) {
    next(error);
  }
};
