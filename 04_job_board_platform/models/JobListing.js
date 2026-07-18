const mongoose = require("mongoose");

const jobListingSchema = new mongoose.Schema(
  {
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Engineering", "Design", "Product", "Marketing", "Sales", "Support", "Operations", "Other"],
      default: "Engineering",
    },
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract", "Remote"],
      default: "Full-Time",
    },
    location: { type: String, default: "Remote" },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    skillsRequired: [{ type: String }],
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

jobListingSchema.index({ title: "text", description: "text", skillsRequired: "text" });

module.exports = mongoose.model("JobListing", jobListingSchema);
