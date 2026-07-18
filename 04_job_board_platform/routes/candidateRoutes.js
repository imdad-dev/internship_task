const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireCandidate } = require("../middleware/auth");
const Candidate = require("../models/Candidate");

router.get("/register", (req, res) => {
  if (req.session.candidate) return res.redirect("/candidate/dashboard");
  res.render("candidate/register", { title: "Candidate Sign Up", layout: false });
});
router.post("/register", authController.candidateRegister);

router.get("/login", (req, res) => {
  if (req.session.candidate) return res.redirect("/candidate/dashboard");
  res.render("candidate/login", { title: "Candidate Login", layout: false });
});
router.post("/login", authController.candidateLogin);
router.get("/logout", authController.candidateLogout);

const layout = "partials/candidate-layout";
router.get("/dashboard", requireCandidate, (req, res) => res.render("candidate/dashboard", { title: "Dashboard", active: "dashboard", layout }));
router.get("/applications", requireCandidate, (req, res) => res.render("candidate/applications", { title: "My Applications", active: "applications", layout }));
router.get("/resume", requireCandidate, (req, res) => res.render("candidate/resume", { title: "My Resume", active: "resume", layout }));
router.get("/profile", requireCandidate, async (req, res) => {
  const profile = await Candidate.findById(req.session.candidate.id);
  res.render("candidate/profile", { title: "My Profile", active: "profile", layout, profile });
});

module.exports = router;
