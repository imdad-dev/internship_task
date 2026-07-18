const JobListing = require("../models/JobListing");
const Application = require("../models/Application");
const Candidate = require("../models/Candidate");
const Employer = require("../models/Employer");

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalJobs, openJobs, totalApplications, totalCandidates, totalEmployers, statusBreakdownRaw] = await Promise.all([
      JobListing.countDocuments(),
      JobListing.countDocuments({ status: "open" }),
      Application.countDocuments(),
      Candidate.countDocuments(),
      Employer.countDocuments(),
      Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    const statusBreakdown = {};
    statusBreakdownRaw.forEach((s) => (statusBreakdown[s._id] = s.count));

    res.json({
      success: true,
      data: { totalJobs, openJobs, totalApplications, totalCandidates, totalEmployers, statusBreakdown },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTopJobsByApplicants = async (req, res) => {
  try {
    const results = await Application.aggregate([
      { $group: { _id: "$job", applicantCount: { $sum: 1 } } },
      { $sort: { applicantCount: -1 } },
      { $limit: 8 },
      { $lookup: { from: "joblistings", localField: "_id", foreignField: "_id", as: "job" } },
      { $unwind: "$job" },
      { $project: { title: "$job.title", applicantCount: 1 } },
    ]);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, count: candidates.length, data: candidates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, count: employers.length, data: employers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });
    res.json({ success: true, message: "Candidate removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteEmployer = async (req, res) => {
  try {
    const employer = await Employer.findByIdAndDelete(req.params.id);
    if (!employer) return res.status(404).json({ success: false, message: "Employer not found" });
    await JobListing.deleteMany({ employer: employer._id });
    res.json({ success: true, message: "Employer removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await JobListing.find().populate("employer", "companyName").sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
