const JobListing = require("../models/JobListing");

exports.renderHome = async (req, res) => {
  const recentJobs = await JobListing.find({ status: "open" }).populate("employer", "companyName logoLetter").sort({ createdAt: -1 }).limit(6);
  const totalOpenJobs = await JobListing.countDocuments({ status: "open" });
  res.render("index", { title: "HireLoop | Find Your Next Role", recentJobs, totalOpenJobs });
};

exports.renderJobsPage = async (req, res) => {
  res.render("jobs", { title: "Browse Jobs | HireLoop" });
};

exports.renderJobDetail = async (req, res) => {
  const job = await JobListing.findById(req.params.id).populate("employer", "companyName logoLetter industry website about");
  if (!job) return res.redirect("/jobs");
  res.render("job-detail", { title: job.title + " | HireLoop", job });
};

exports.renderAbout = (req, res) => {
  res.render("about", { title: "About | HireLoop" });
};
