const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { requireAdminApi } = require("../middleware/auth");

router.use(requireAdminApi); // entire inventory API is admin-only

router.get("/", inventoryController.getAllInventory);
router.get("/low-stock", inventoryController.getLowStockItems);
router.post("/", inventoryController.createInventoryItem);
router.put("/:id", inventoryController.updateInventoryItem);
router.patch("/:id/adjust", inventoryController.adjustStock);
router.delete("/:id", inventoryController.deleteInventoryItem);

module.exports = router;
