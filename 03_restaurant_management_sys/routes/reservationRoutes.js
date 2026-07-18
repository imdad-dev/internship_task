const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const { requireAdminApi } = require("../middleware/auth");

router.get("/", requireAdminApi, reservationController.getAllReservations);
router.post("/", reservationController.createReservation); // public - customer reserves
router.patch("/:id/status", requireAdminApi, reservationController.updateReservationStatus);
router.delete("/:id", requireAdminApi, reservationController.deleteReservation);

module.exports = router;
