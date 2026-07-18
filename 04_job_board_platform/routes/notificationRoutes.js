const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get("/", notificationController.getMyNotifications);
router.patch("/mark-read", notificationController.markAllRead);

module.exports = router;
