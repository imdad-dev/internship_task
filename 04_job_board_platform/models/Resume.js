const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
    fileName: { type: String, required: true }, // original file name shown to users
    filePath: { type: String, required: true }, // /uploads/resumes/xxx.pdf
    fileSize: { type: Number, default: 0 }, // bytes
    isPrimary: { type: Boolean, default: true }, // most recently uploaded = active resume
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
