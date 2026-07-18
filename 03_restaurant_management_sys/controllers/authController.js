const Admin = require("../models/Admin");

exports.showLogin = (req, res) => {
  if (req.session.admin) return res.redirect("/admin/dashboard");
  res.render("admin/login", { title: "Admin Login", layout: false, error: req.flash("error") });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });

    if (!admin) {
      req.flash("error", "Invalid username or password");
      return res.redirect("/admin/login");
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      req.flash("error", "Invalid username or password");
      return res.redirect("/admin/login");
    }

    req.session.admin = {
      id: admin._id,
      name: admin.name,
      username: admin.username,
      role: admin.role,
    };

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/admin/login");
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
};
