const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

exports.getAllReservations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const reservations = await Reservation.find(filter)
      .populate("table", "tableNumber capacity location")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reservations.length, data: reservations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const { customerName, phone, email, tableId, guests, date, time, specialRequest } = req.body;

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ success: false, message: "Selected table not found" });
    }
    if (table.status !== "available") {
      return res.status(400).json({ success: false, message: `Table ${table.tableNumber} is currently ${table.status}. Please choose another table.` });
    }
    if (Number(guests) > table.capacity) {
      return res.status(400).json({ success: false, message: `Table ${table.tableNumber} only seats ${table.capacity} guests.` });
    }

    const reservation = await Reservation.create({
      customerName,
      phone,
      email,
      table: table._id,
      guests,
      date,
      time,
      specialRequest,
      status: "pending",
    });

    // Mark table reserved so it isn't double-booked
    table.status = "reserved";
    await table.save();

    res.status(201).json({ success: true, data: reservation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id).populate("table");
    if (!reservation) return res.status(404).json({ success: false, message: "Reservation not found" });

    reservation.status = status;
    await reservation.save();

    // Free up or occupy the table depending on new status
    if (reservation.table) {
      if (status === "cancelled" || status === "completed") {
        reservation.table.status = "available";
        await reservation.table.save();
      } else if (status === "confirmed") {
        reservation.table.status = "reserved";
        await reservation.table.save();
      }
    }

    res.json({ success: true, data: reservation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ success: false, message: "Reservation not found" });
    res.json({ success: true, message: "Reservation deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
