const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
} = require("../controllers/eventController");
const { protect, authorize } = require("../middleware/auth");

// Organizer's own events - must be defined before "/:id"
router.get("/organizer/mine", protect, authorize("organizer"), getMyEvents);

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", protect, authorize("organizer"), createEvent);
router.put("/:id", protect, authorize("organizer"), updateEvent);
router.delete("/:id", protect, authorize("organizer"), deleteEvent);

module.exports = router;
