const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { requireAdminApi } = require("../middleware/auth");

router.use(requireAdminApi); // entire reporting API is admin-only

router.get("/dashboard", reportController.getDashboardStats);
router.get("/daily-sales", reportController.getDailySalesReport);
router.get("/top-selling", reportController.getTopSellingItems);
router.get("/stock-alerts", reportController.getStockAlerts);

module.exports = router;
