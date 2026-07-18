// Protects admin panel routes - redirects to login if no active session
exports.requireAdmin = (req, res, next) => {
  if (req.session && req.session.admin) {
    res.locals.admin = req.session.admin;
    return next();
  }
  req.flash("error", "Please log in to access the admin panel");
  return res.redirect("/admin/login");
};

// Protects JSON APIs meant only for admin use
exports.requireAdminApi = (req, res, next) => {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ success: false, message: "Unauthorized. Admin login required." });
};

// Restrict certain actions to superadmin role only
exports.requireSuperAdmin = (req, res, next) => {
  if (req.session && req.session.admin && req.session.admin.role === "superadmin") return next();
  return res.status(403).json({ success: false, message: "Forbidden. Superadmin privileges required." });
};
