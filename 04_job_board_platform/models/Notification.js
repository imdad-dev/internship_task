const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientType: { type: String, enum: ["employer", "candidate"], required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "recipientModel" },
    recipientModel: { type: String, enum: ["Employer", "Candidate"], required: true },
    message: { type: String, required: true },
    link: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
