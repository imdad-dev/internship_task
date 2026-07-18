const Application = require("../models/Application");
const JobListing = require("../models/JobListing");
const Resume = require("../models/Resume");
const Notification = require("../models/Notification");

// POST /api/applications - candidate applies to a job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resumeId } = req.body;
    const candidateId = req.session.candidate.id;

    const job = await JobListing.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.status !== "open") return res.status(400).json({ success: false, message: "This job is no longer accepting applications" });

    let resume = resumeId
      ? await Resume.findOne({ _id: resumeId, candidate: candidateId })
      : await Resume.findOne({ candidate: candidateId, isPrimary: true });

    if (!resume) {
      return res.status(400).json({ success: false, message: "Please upload a resume before applying" });
    }

    const existing = await Application.findOne({ job: jobId, candidate: candidateId });
    if (existing) return res.status(400).json({ success: false, message: "You've already applied to this job" });

    const application = await Application.create({
      job: jobId,
      candidate: candidateId,
      resume: resume._id,
      coverLetter,
    });

    // Notify the employer of the new applicant
    await Notification.create({
      recipientType: "employer",
      recipient: job.employer,
      recipientModel: "Employer",
      message: `New applicant for "${job.title}": ${req.session.candidate.name}`,
      link: "/employer/jobs",
    });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "You've already applied to this job" });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/applications/mine - candidate tracks their own applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.session.candidate.id })
      .populate({ path: "job", populate: { path: "employer", select: "companyName logoLetter" } })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/applications/job/:jobId - employer views applicants for one of their jobs
exports.getApplicationsForJob = async (req, res) => {
  try {
    const job = await JobListing.findOne({ _id: req.params.jobId, employer: req.session.employer.id });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const applications = await Application.find({ job: job._id })
      .populate("candidate", "name email headline skills location experienceYears")
      .populate("resume", "fileName filePath")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/applications/:id/status - employer updates status, candidate gets notified
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    if (application.job.employer.toString() !== req.session.employer.id) {
      return res.status(403).json({ success: false, message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    await Notification.create({
      recipientType: "candidate",
      recipient: application.candidate,
      recipientModel: "Candidate",
      message: `Your application for "${application.job.title}" is now "${status}"`,
      link: "/candidate/applications",
    });

    res.json({ success: true, data: application });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
