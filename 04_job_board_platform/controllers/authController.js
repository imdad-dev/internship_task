const Candidate = require("../models/Candidate");
const Employer = require("../models/Employer");
const Admin = require("../models/Admin");

// ---------------- Candidate ----------------
exports.candidateRegister = async (req, res) => {
  try {
    const { name, email, password, headline, location } = req.body;
    const existing = await Candidate.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      req.flash("error", "An account with this email already exists");
      return res.redirect("/candidate/register");
    }
    const candidate = await Candidate.create({ name, email, password, headline, location });
    req.session.candidate = { id: candidate._id, name: candidate.name, email: candidate.email };
    res.redirect("/candidate/dashboard");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/candidate/register");
  }
};

exports.candidateLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await Candidate.findOne({ email: email.toLowerCase().trim() });
    if (!candidate || !(await candidate.comparePassword(password))) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/candidate/login");
    }
    req.session.candidate = { id: candidate._id, name: candidate.name, email: candidate.email };
    res.redirect("/candidate/dashboard");
  } catch (err) {
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/candidate/login");
  }
};

exports.candidateLogout = (req, res) => {
  delete req.session.candidate;
  res.redirect("/candidate/login");
};

// ---------------- Employer ----------------
exports.employerRegister = async (req, res) => {
  try {
    const { companyName, contactName, email, password, industry, website } = req.body;
    const existing = await Employer.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      req.flash("error", "An account with this email already exists");
      return res.redirect("/employer/register");
    }
    const employer = await Employer.create({
      companyName,
      contactName,
      email,
      password,
      industry,
      website,
      logoLetter: companyName.charAt(0).toUpperCase(),
    });
    req.session.employer = { id: employer._id, companyName: employer.companyName, email: employer.email };
    res.redirect("/employer/dashboard");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/employer/register");
  }
};

exports.employerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employer = await Employer.findOne({ email: email.toLowerCase().trim() });
    if (!employer || !(await employer.comparePassword(password))) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/employer/login");
    }
    req.session.employer = { id: employer._id, companyName: employer.companyName, email: employer.email };
    res.redirect("/employer/dashboard");
  } catch (err) {
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/employer/login");
  }
};

exports.employerLogout = (req, res) => {
  delete req.session.employer;
  res.redirect("/employer/login");
};

// ---------------- Admin ----------------
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
    if (!admin || !(await admin.comparePassword(password))) {
      req.flash("error", "Invalid username or password");
      return res.redirect("/admin/login");
    }
    req.session.admin = { id: admin._id, name: admin.name, username: admin.username };
    res.redirect("/admin/dashboard");
  } catch (err) {
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/admin/login");
  }
};

exports.adminLogout = (req, res) => {
  delete req.session.admin;
  res.redirect("/admin/login");
};
