const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Event capacity is required"],
      min: 1,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual to get number of confirmed registrations
eventSchema.virtual("registrations", {
  ref: "Registration",
  localField: "_id",
  foreignField: "event",
});

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);
