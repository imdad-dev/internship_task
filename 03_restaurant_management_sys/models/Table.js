const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    capacity: { type: Number, required: true, default: 4 },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved"],
      default: "available",
    },
    location: { type: String, default: "Main Hall" }, // e.g. Main Hall, Patio, Balcony
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);
