const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireEmployer } = require("../middleware/auth");

router.get("/register", (req, res) => {
  if (req.session.employer) return res.redirect("/employer/dashboard");
  res.render("employer/register", { title: "Employer Sign Up", layout: false });
});
router.post("/register", authController.employerRegister);

router.get("/login", (req, res) => {
  if (req.session.employer) return res.redirect("/employer/dashboard");
  res.render("employer/login", { title: "Employer Login", layout: false });
});
router.post("/login", authController.employerLogin);
router.get("/logout", authController.employerLogout);

const layout = "partials/employer-layout";
router.get("/dashboard", requireEmployer, (req, res) => res.render("employer/dashboard", { title: "Dashboard", active: "dashboard", layout }));
router.get("/jobs", requireEmployer, (req, res) => res.render("employer/jobs", { title: "My Job Listings", active: "jobs", layout }));
router.get("/applicants", requireEmployer, (req, res) => res.render("employer/applicants", { title: "Applicants", active: "applicants", layout }));

module.exports = router;
