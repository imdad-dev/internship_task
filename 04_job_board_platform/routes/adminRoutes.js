const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireAdmin } = require("../middleware/auth");

router.get("/login", (req, res) => {
  if (req.session.admin) return res.redirect("/admin/dashboard");
  res.render("admin/login", { title: "Admin Login", layout: false, error: req.flash("error") });
});
router.post("/login", authController.adminLogin);
router.get("/logout", authController.adminLogout);

const layout = "partials/admin-layout";
router.get("/dashboard", requireAdmin, (req, res) => res.render("admin/dashboard", { title: "Dashboard", active: "dashboard", layout }));
router.get("/jobs", requireAdmin, (req, res) => res.render("admin/jobs", { title: "All Jobs", active: "jobs", layout }));
router.get("/candidates", requireAdmin, (req, res) => res.render("admin/candidates", { title: "Candidates", active: "candidates", layout }));
router.get("/employers", requireAdmin, (req, res) => res.render("admin/employers", { title: "Employers", active: "employers", layout }));

router.get("/", requireAdmin, (req, res) => res.redirect("/admin/dashboard"));

module.exports = router;
