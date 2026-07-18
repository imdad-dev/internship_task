const Resume = require("../models/Resume");
const fs = require("fs");
const path = require("path");

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Please attach a PDF, DOC, or DOCX file" });

    // Mark previous resumes as non-primary - the latest upload becomes the active one
    await Resume.updateMany({ candidate: req.session.candidate.id }, { isPrimary: false });

    const resume = await Resume.create({
      candidate: req.session.candidate.id,
      fileName: req.file.originalname,
      filePath: "/uploads/resumes/" + req.file.filename,
      fileSize: req.file.size,
      isPrimary: true,
    });

    res.status(201).json({ success: true, data: resume });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ candidate: req.session.candidate.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: resumes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, candidate: req.session.candidate.id });
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });

    const filePath = path.join(__dirname, "..", "public", resume.filePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await resume.deleteOne();
    res.json({ success: true, message: "Resume removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
