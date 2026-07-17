const express = require("express");
const router = express.Router();
const { optionalAuth } = require("../middleware/auth");

router.get("/", optionalAuth, (req, res) => {
  res.render("index", { page: "home", user: req.user || null });
});

router.get("/events", optionalAuth, (req, res) => {
  res.render("events", { page: "events", user: req.user || null });
});

router.get("/events/:id", optionalAuth, (req, res) => {
  res.render("event-details", {
    page: "event-details",
    user: req.user || null,
    eventId: req.params.id,
  });
});

router.get("/login", optionalAuth, (req, res) => {
  res.render("login", { page: "login", user: req.user || null });
});

router.get("/register", optionalAuth, (req, res) => {
  res.render("register", { page: "register", user: req.user || null });
});

router.get("/dashboard", optionalAuth, (req, res) => {
  if (!req.user) return res.redirect("/login");
  res.render("dashboard", { page: "dashboard", user: req.user });
});

router.get("/admin/events", optionalAuth, (req, res) => {
  if (!req.user || req.user.role !== "organizer") return res.redirect("/login");
  res.render("admin/manage-events", { page: "admin-events", user: req.user });
});

router.get("/admin/events/new", optionalAuth, (req, res) => {
  if (!req.user || req.user.role !== "organizer") return res.redirect("/login");
  res.render("admin/create-event", { page: "admin-create", user: req.user });
});

router.get("/admin/events/:id/edit", optionalAuth, (req, res) => {
  if (!req.user || req.user.role !== "organizer") return res.redirect("/login");
  res.render("admin/create-event", {
    page: "admin-edit",
    user: req.user,
    editEventId: req.params.id,
  });
});

router.get("/admin/events/:id/registrations", optionalAuth, (req, res) => {
  if (!req.user || req.user.role !== "organizer") return res.redirect("/login");
  res.render("admin/registrations", {
    page: "admin-registrations",
    user: req.user,
    eventId: req.params.id,
  });
});

module.exports = router;
