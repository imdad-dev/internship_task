const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireAdmin } = require("../middleware/auth");

// Auth pages
router.get("/login", authController.showLogin);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// Protected admin panel pages (data is loaded client-side via jQuery + the API routes)
const adminLayout = "partials/admin-layout";
router.get("/dashboard", requireAdmin, (req, res) => res.render("admin/dashboard", { title: "Dashboard", active: "dashboard", layout: adminLayout }));
router.get("/menu", requireAdmin, (req, res) => res.render("admin/menu", { title: "Manage Menu", active: "menu", layout: adminLayout }));
router.get("/orders", requireAdmin, (req, res) => res.render("admin/orders", { title: "Manage Orders", active: "orders", layout: adminLayout }));
router.get("/tables", requireAdmin, (req, res) => res.render("admin/tables", { title: "Manage Tables", active: "tables", layout: adminLayout }));
router.get("/reservations", requireAdmin, (req, res) => res.render("admin/reservations", { title: "Reservations", active: "reservations", layout: adminLayout }));
router.get("/inventory", requireAdmin, (req, res) => res.render("admin/inventory", { title: "Manage Inventory", active: "inventory", layout: adminLayout }));
router.get("/reports", requireAdmin, (req, res) => res.render("admin/reports", { title: "Reports", active: "reports", layout: adminLayout }));

router.get("/", requireAdmin, (req, res) => res.redirect("/admin/dashboard"));

module.exports = router;
