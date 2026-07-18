const JobListing = require("../models/JobListing");
const Application = require("../models/Application");

// GET /api/jobs - search & filter
exports.getAllJobs = async (req, res) => {
  try {
    const { q, category, jobType, location, minSalary, status } = req.query;
    const filter = {};

    if (status) filter.status = status;
    else filter.status = "open"; // public search defaults to open roles only

    if (category) filter.category = category;
    if (jobType) filter.jobType = jobType;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (minSalary) filter.salaryMax = { $gte: Number(minSalary) };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { skillsRequired: { $regex: q, $options: "i" } },
      ];
    }

    const jobs = await JobListing.find(filter).populate("employer", "companyName logoLetter industry").sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await JobListing.findById(req.params.id).populate("employer", "companyName logoLetter industry website about");
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/jobs/mine - employer's own listings
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await JobListing.find({ employer: req.session.employer.id }).sort({ createdAt: -1 });
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ job: job._id });
        return { ...job.toObject(), applicantCount };
      })
    );
    res.json({ success: true, count: jobsWithCounts.length, data: jobsWithCounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const body = req.body;
    body.skillsRequired = Array.isArray(body.skillsRequired)
      ? body.skillsRequired
      : (body.skillsRequired || "").split(",").map((s) => s.trim()).filter(Boolean);

    const job = await JobListing.create({ ...body, employer: req.session.employer.id });
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await JobListing.findOne({ _id: req.params.id, employer: req.session.employer.id });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const body = req.body;
    if (body.skillsRequired) {
      body.skillsRequired = Array.isArray(body.skillsRequired)
        ? body.skillsRequired
        : body.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean);
    }

    Object.assign(job, body);
    await job.save();
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.toggleJobStatus = async (req, res) => {
  try {
    const job = await JobListing.findOne({ _id: req.params.id, employer: req.session.employer.id });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    job.status = job.status === "open" ? "closed" : "open";
    await job.save();
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/jobs/stats - employer dashboard summary
exports.getEmployerStats = async (req, res) => {
  try {
    const jobs = await JobListing.find({ employer: req.session.employer.id });
    const jobIds = jobs.map((j) => j._id);
    const activeListings = jobs.filter((j) => j.status === "open").length;

    const statusCounts = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const breakdown = {};
    statusCounts.forEach((s) => (breakdown[s._id] = s.count));
    const totalApplicants = Object.values(breakdown).reduce((a, b) => a + b, 0);

    res.json({
      success: true,
      data: {
        activeListings,
        totalApplicants,
        interview: breakdown.interview || 0,
        hired: breakdown.hired || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await JobListing.findOneAndDelete({ _id: req.params.id, employer: req.session.employer.id });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    await Application.deleteMany({ job: job._id });
    res.json({ success: true, message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
