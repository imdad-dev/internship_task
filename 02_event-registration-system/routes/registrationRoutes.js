const express = require("express");
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventRegistrations,
} = require("../controllers/registrationController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, registerForEvent);
router.get("/my", protect, getMyRegistrations);
router.delete("/:id", protect, cancelRegistration);
router.get("/event/:eventId", protect, authorize("organizer"), getEventRegistrations);

module.exports = router;
