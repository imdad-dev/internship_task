const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "JobListing", required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    coverLetter: { type: String, default: "" },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview", "rejected", "hired"],
      default: "applied",
    },
  },
  { timestamps: true }
);

// A candidate can only apply once per job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
