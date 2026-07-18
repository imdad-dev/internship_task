const Candidate = require("../models/Candidate");

exports.updateProfile = async (req, res) => {
  try {
    const { headline, location, experienceYears, skills } = req.body;
    const candidate = await Candidate.findById(req.session.candidate.id);
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

    if (headline !== undefined) candidate.headline = headline;
    if (location !== undefined) candidate.location = location;
    if (experienceYears !== undefined) candidate.experienceYears = experienceYears;
    if (skills !== undefined) {
      candidate.skills = Array.isArray(skills) ? skills : skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    await candidate.save();
    res.json({ success: true, data: candidate });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
