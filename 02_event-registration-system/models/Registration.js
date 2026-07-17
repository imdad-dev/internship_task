const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    // Snapshot fields captured from the registration form
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

// Prevent the same user from registering twice for the same event
// (unless their previous registration was cancelled)
registrationSchema.index({ user: 1, event: 1 }, { unique: false });

module.exports = mongoose.model("Registration", registrationSchema);
