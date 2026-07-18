// Page guards - redirect to the right login screen
exports.requireCandidate = (req, res, next) => {
  if (req.session && req.session.candidate) return next();
  req.flash("error", "Please log in to continue");
  return res.redirect("/candidate/login");
};

exports.requireEmployer = (req, res, next) => {
  if (req.session && req.session.employer) return next();
  req.flash("error", "Please log in to continue");
  return res.redirect("/employer/login");
};

exports.requireAdmin = (req, res, next) => {
  if (req.session && req.session.admin) return next();
  req.flash("error", "Please log in to continue");
  return res.redirect("/admin/login");
};

// API guards - JSON 401 instead of redirect
exports.requireCandidateApi = (req, res, next) => {
  if (req.session && req.session.candidate) return next();
  return res.status(401).json({ success: false, message: "Candidate login required" });
};

exports.requireEmployerApi = (req, res, next) => {
  if (req.session && req.session.employer) return next();
  return res.status(401).json({ success: false, message: "Employer login required" });
};

exports.requireAdminApi = (req, res, next) => {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ success: false, message: "Admin login required" });
};
