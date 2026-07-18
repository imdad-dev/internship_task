const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");
const { requireAdminApi } = require("../middleware/auth");

router.get("/", tableController.getAllTables);
router.get("/available", tableController.checkAvailability);
router.post("/", requireAdminApi, tableController.createTable);
router.put("/:id", requireAdminApi, tableController.updateTable);
router.patch("/:id/status", requireAdminApi, tableController.updateTableStatus);
router.delete("/:id", requireAdminApi, tableController.deleteTable);

module.exports = router;
