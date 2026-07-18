const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    guests: { type: Number, required: true, min: 1 },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:MM
    specialRequest: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
